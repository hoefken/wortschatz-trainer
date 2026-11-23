import { inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { TermService } from '../../../terms/term.service';
import { WordPairDialog } from './word-pair-dialog.component';

describe('WordPairDialog', () => {
  let loader: HarnessLoader;
  let close: ReturnType<typeof vi.fn>;

  function setUp(mode: 'add' | 'edit' = 'add') {
    close = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useFactory: () => ({
            wordPair: mode === 'edit' ? inject(TermService).wordPairs()[0] : undefined,
          }),
        },
        { provide: MatDialogRef, useValue: { close } },
      ],
    });
    TestBed.inject(TermService).add({ source: 'Haus', target: 'house' });
    loader = TestbedHarnessEnvironment.loader(TestBed.createComponent(WordPairDialog));
  }

  async function fill(source: string, target: string) {
    const [sourceInput, targetInput] = await loader.getAllHarnesses(MatInputHarness);
    await sourceInput.setValue(source);
    await targetInput.setValue(target);
  }

  async function submit(label: string) {
    await (await loader.getHarness(MatButtonHarness.with({ text: label }))).click();
  }

  async function errors() {
    const fields = await loader.getAllHarnesses(MatFormFieldHarness);
    return (await Promise.all(fields.map(field => field.getTextErrors()))).flat();
  }

  it('returns the new word pair', async () => {
    setUp();

    await fill('Baum', 'tree');
    await submit('Hinzufügen');

    expect(close).toHaveBeenCalledWith({ source: 'Baum', target: 'tree' });
  });

  it('requires both words', async () => {
    setUp();

    await submit('Hinzufügen');

    expect(close).not.toHaveBeenCalled();
    expect(await errors()).toEqual([
      'Bitte ein Wort eingeben.',
      'Bitte eine Übersetzung eingeben.',
    ]);
  });

  it('rejects a word that is already in the list', async () => {
    setUp();

    await fill('haus', 'home');
    await submit('Hinzufügen');

    expect(close).not.toHaveBeenCalled();
    expect(await errors()).toEqual(['Dieses Wort ist bereits erfasst.']);
  });

  it('lets an existing word pair keep its own word', async () => {
    setUp('edit');

    await fill('Haus', 'home');
    await submit('Speichern');

    expect(close).toHaveBeenCalledWith({ source: 'Haus', target: 'home' });
  });
});

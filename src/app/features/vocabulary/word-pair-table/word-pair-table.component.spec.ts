import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSortHarness } from '@angular/material/sort/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { TermService } from '../../../terms/term.service';
import { WordPairTable } from './word-pair-table.component';

class GermanSwedishTermService extends TermService {
  override readonly targetLanguage = { code: 'sv', name: 'Schwedisch' };
}

describe('WordPairTable', () => {
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TermService, useClass: GermanSwedishTermService }],
    });
    const terms = TestBed.inject(TermService);
    terms.add({ source: 'Zeit', target: 'tid' });
    terms.add({ source: 'Ärger', target: 'ärlig' });
    terms.add({ source: 'Apfel', target: 'äpple' });
    terms.add({ source: 'Affe', target: 'apa' });
    loader = TestbedHarnessEnvironment.loader(TestBed.createComponent(WordPairTable));
  });

  async function column(index: number) {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getCellTextByIndex();
    return rows.map(cells => cells[index]);
  }

  async function sortByTarget() {
    const sort = await loader.getHarness(MatSortHarness);
    const [, target] = await sort.getSortHeaders();
    await target.click();
    return target;
  }

  it('labels the columns with the language names', async () => {
    const sort = await loader.getHarness(MatSortHarness);
    const labels = await Promise.all(
      (await sort.getSortHeaders()).map(header => header.getLabel()),
    );

    expect(labels).toEqual(['Deutsch', 'Schwedisch']);
  });

  it('sorts by the source language with its own rules: German umlauts next to their base letter', async () => {
    expect(await column(0)).toEqual(['Affe', 'Apfel', 'Ärger', 'Zeit']);
  });

  it('sorts by the target language with its own rules: Swedish ä after z', async () => {
    await sortByTarget();

    expect(await column(1)).toEqual(['apa', 'tid', 'äpple', 'ärlig']);
  });

  it('sorts in both directions', async () => {
    const target = await sortByTarget();
    await target.click();

    expect(await column(1)).toEqual(['ärlig', 'äpple', 'tid', 'apa']);
  });
});

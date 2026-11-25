import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TermService } from '../../../term/term.service';
import { UnsavedWordPair, WordPair } from '../../../term/word-pair';

export interface WordPairDialogData {
  readonly wordPair?: WordPair;
}

@Component({
  imports: [FormField, FormRoot, MatButton, MatDialogModule, MatFormFieldModule, MatInput],
  selector: 'loco-word-pair-dialog',
  styleUrl: './word-pair.dialog.scss',
  templateUrl: './word-pair.dialog.html',
})
export class WordPairDialog {
  private readonly data = inject<WordPairDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<WordPairDialog, UnsavedWordPair>>(MatDialogRef);
  protected readonly terms = inject(TermService);
  protected readonly isEdit = this.data.wordPair !== undefined;

  private readonly model = signal<UnsavedWordPair>({
    source: this.data.wordPair?.source ?? '',
    target: this.data.wordPair?.target ?? '',
  });

  protected readonly form = form(
    this.model,
    path => {
      required(path.source, { message: 'Bitte ein Wort eingeben.' });
      required(path.target, { message: 'Bitte eine Übersetzung eingeben.' });
      validate(path.source, ({ value }) =>
        this.terms.isDuplicate(value(), this.data.wordPair?.id)
          ? { kind: 'duplicate', message: 'Dieses Wort ist bereits erfasst.' }
          : null,
      );
    },
    {
      submission: {
        action: async () => {
          this.dialogRef.close(this.model());
          return null;
        },
      },
    },
  );
}

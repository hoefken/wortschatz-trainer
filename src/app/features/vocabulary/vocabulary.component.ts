import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { lastValueFrom } from 'rxjs';
import { confirm } from '../../shared/dialogs/confirm.dialog';
import { TermService } from '../../term/term.service';
import { UnsavedWordPair, WordPair } from '../../shared/models/word-pair';
import { WordPairDialog, WordPairDialogData } from './word-pair-dialog/word-pair.dialog';
import { WordPairTable } from './word-pair-table/word-pair-table.component';

@Component({
  imports: [MatButton, MatIcon, WordPairTable],
  selector: 'loco-vocabulary',
  styleUrl: './vocabulary.component.scss',
  templateUrl: './vocabulary.component.html',
})
export class Vocabulary {
  private readonly dialog = inject(MatDialog);
  protected readonly terms = inject(TermService);

  protected async add(): Promise<void> {
    const words = await this.openWordPairDialog({});
    if (words) {
      this.terms.add(words);
    }
  }

  protected async edit(wordPair: WordPair): Promise<void> {
    const words = await this.openWordPairDialog({ wordPair });
    if (words) {
      this.terms.update({ id: wordPair.id, ...words });
    }
  }

  protected async remove({ id, source, target }: WordPair): Promise<void> {
    const confirmed = await confirm(this.dialog, {
      title: 'Wortpaar löschen?',
      message: `„${source} – ${target}“ wird aus der Wortliste entfernt.`,
      confirmLabel: 'Löschen',
    });
    if (confirmed) {
      this.terms.remove(id);
    }
  }

  protected async reset(): Promise<void> {
    const confirmed = await confirm(this.dialog, {
      title: 'Alles zurücksetzen?',
      message: 'Alle Wortpaare werden gelöscht. Das lässt sich nicht rückgängig machen.',
      confirmLabel: 'Alles löschen',
    });
    if (confirmed) {
      this.terms.reset();
    }
  }

  private openWordPairDialog(data: WordPairDialogData): Promise<UnsavedWordPair | undefined> {
    const dialogRef = this.dialog.open<WordPairDialog, WordPairDialogData, UnsavedWordPair>(
      WordPairDialog,
      { data },
    );
    return lastValueFrom(dialogRef.afterClosed());
  }
}

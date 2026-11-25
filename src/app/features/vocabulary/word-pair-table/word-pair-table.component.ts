import { Component, computed, inject, output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Language } from '../../../shared/models/language';
import { TermService } from '../../../term/term.service';
import { WordPair } from '../../../shared/models/word-pair';

type SortColumn = 'source' | 'target';

function collatorFor(language: Language): Intl.Collator {
  return new Intl.Collator(language.code, { sensitivity: 'base' });
}

@Component({
  imports: [MatIcon, MatIconButton, MatSortModule, MatTableModule],
  selector: 'loco-word-pair-table',
  styleUrl: './word-pair-table.component.scss',
  templateUrl: './word-pair-table.component.html',
})
export class WordPairTable {
  protected readonly terms = inject(TermService);
  readonly edit = output<WordPair>();
  readonly remove = output<WordPair>();

  protected readonly columns = ['source', 'target', 'actions'];
  protected readonly sort = signal<Sort>({ active: 'source', direction: 'asc' });

  private readonly collators = {
    source: collatorFor(this.terms.sourceLanguage),
    target: collatorFor(this.terms.targetLanguage),
  };

  protected readonly rows = computed(() => {
    const { active, direction } = this.sort();
    const column = active as SortColumn;
    const collator = this.collators[column];
    const order = direction === 'desc' ? -1 : 1;
    return [...this.terms.wordPairs()].sort(
      (a, b) => order * collator.compare(a[column], b[column]),
    );
  });
}

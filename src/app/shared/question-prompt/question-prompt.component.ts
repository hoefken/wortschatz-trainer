import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Question } from '../../terms/question';

@Component({
  imports: [MatIcon],
  selector: 'loco-question-prompt',
  styleUrl: './question-prompt.component.scss',
  template: `
    @let q = question();
    <p class="direction">{{ q.from.name }} <mat-icon svgIcon="arrow_forward" /> {{ q.to.name }}</p>
    <p class="prompt">Wie heißt das auf {{ q.to.name }}?</p>
    <h2 class="word" [lang]="q.from.code">{{ q.word }}</h2>
  `,
})
export class QuestionPrompt {
  readonly question = input.required<Question>();
}

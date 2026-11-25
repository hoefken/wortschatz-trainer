import { Component, computed, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ExamResult, ExamSession } from '../exam-session';

@Component({
  imports: [MatButton, MatIcon, RouterLink],
  selector: 'loco-exam-summary',
  styleUrl: './exam-summary.component.scss',
  templateUrl: './exam-summary.component.html',
})
export class ExamSummary {
  readonly result = input.required<ExamResult>();

  protected readonly session = inject(ExamSession);

  protected readonly duration = computed(() => {
    const seconds = Math.round(this.result().duration / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  });
}

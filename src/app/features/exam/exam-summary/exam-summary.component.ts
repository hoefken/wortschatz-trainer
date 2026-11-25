import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DurationPipe } from '../duration.pipe';
import { ExamResult } from '../exam-session.service';

@Component({
  imports: [DurationPipe, MatButton, MatIcon, RouterLink],
  selector: 'loco-exam-summary',
  styleUrl: './exam-summary.component.scss',
  templateUrl: './exam-summary.component.html',
})
export class ExamSummary {
  readonly result = input.required<ExamResult>();
  readonly restart = output<void>();
}

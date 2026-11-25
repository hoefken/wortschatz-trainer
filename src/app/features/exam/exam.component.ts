import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TermService } from '../../term/term.service';
import { ExamQuestion } from './exam-question/exam-question.component';
import { ExamSummary } from './exam-summary/exam-summary.component';
import { ExamSession } from './exam-session.service';
import { ExamSetup } from './exam-setup/exam-setup.component';

@Component({
  imports: [ExamQuestion, ExamSetup, ExamSummary, MatButton, RouterLink],
  selector: 'loco-exam',
  styleUrl: './exam.component.scss',
  templateUrl: './exam.component.html',
})
export class Exam {
  protected readonly session = inject(ExamSession);
  protected readonly terms = inject(TermService);
}

import { Component, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ExamSession } from '../../features/exam/exam-session.service';
import { TermService } from '../../term/term.service';

@Component({
  imports: [MatIcon, MatTabsModule, MatTooltip, RouterLink, RouterLinkActive],
  selector: 'loco-nav-bar',
  styleUrl: './nav-bar.component.scss',
  templateUrl: './nav-bar.component.html',
})
export class NavBar {
  readonly tabPanel = input.required<MatTabNavPanel>();
  protected readonly terms = inject(TermService);
  protected readonly exam = inject(ExamSession);

  // Mirrors the routes guarded by lockedDuringExam, so the tabs show the lock the router enforces.
  protected readonly sections = [
    { path: 'vocabulary', label: 'Erfassen', lockedDuringExam: true },
    { path: 'training', label: 'Trainieren', lockedDuringExam: true },
    { path: 'exam', label: 'Prüfung', lockedDuringExam: false },
  ];

  protected readonly lockReason = 'Während einer laufenden Prüfung gesperrt';
}

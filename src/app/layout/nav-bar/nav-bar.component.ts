import { Component, inject, input } from '@angular/core';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TermService } from '../../terms/term.service';

@Component({
  imports: [RouterLink, RouterLinkActive, MatTabsModule],
  selector: 'loco-nav-bar',
  styleUrl: './nav-bar.component.scss',
  templateUrl: './nav-bar.component.html',
})
export class NavBar {
  readonly tabPanel = input.required<MatTabNavPanel>();
  protected readonly terms = inject(TermService);

  protected readonly sections = [
    { path: 'vocabulary', label: 'Erfassen' },
    { path: 'training', label: 'Trainieren' },
    { path: 'exam', label: 'Prüfung' },
  ];
}

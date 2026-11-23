import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, MatTabsModule, MatChipsModule],
  selector: 'loco-nav-bar',
  styleUrl: './nav-bar.component.scss',
  templateUrl: './nav-bar.component.html',
})
export class NavBar {
  readonly tabPanel = input.required<MatTabNavPanel>();

  protected readonly sections = [
    { path: 'vocabulary', label: 'Erfassen' },
    { path: 'training', label: 'Trainieren' },
    { path: 'exam', label: 'Prüfung' },
  ];
}

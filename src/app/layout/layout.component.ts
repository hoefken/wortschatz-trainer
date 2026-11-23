import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './nav-bar/nav-bar.component';

@Component({
  imports: [RouterOutlet, MatTabsModule, NavBar],
  selector: 'loco-layout',
  styleUrl: './layout.component.scss',
  templateUrl: './layout.component.html',
})
export class Layout {}

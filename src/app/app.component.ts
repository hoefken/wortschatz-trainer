import { Component } from '@angular/core';
import { Layout } from './layout/layout.component';

@Component({
  imports: [Layout],
  selector: 'loco-root',
  template: '<loco-layout />',
})
export class App {}

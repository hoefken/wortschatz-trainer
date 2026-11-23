import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'vocabulary' },
  {
    path: 'vocabulary',
    title: 'Erfassen · Wortschatz-Trainer',
    loadComponent: () =>
      import('./features/vocabulary/vocabulary.component').then(m => m.Vocabulary),
  },
  {
    path: 'training',
    title: 'Trainieren · Wortschatz-Trainer',
    loadComponent: () => import('./features/training/training.component').then(m => m.Training),
  },
  {
    path: 'exam',
    title: 'Prüfung · Wortschatz-Trainer',
    loadComponent: () => import('./features/exam/exam.component').then(m => m.Exam),
  },
  { path: '**', redirectTo: 'vocabulary' },
];

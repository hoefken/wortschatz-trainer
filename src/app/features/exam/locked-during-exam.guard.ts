import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ExamSession } from './exam-session.service';

export const lockedDuringExam: CanActivateFn = () =>
  inject(ExamSession).running() ? inject(Router).createUrlTree(['/exam']) : true;

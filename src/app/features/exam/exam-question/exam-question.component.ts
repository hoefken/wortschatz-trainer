import { afterNextRender, Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { lastValueFrom } from 'rxjs';
import { ConfirmDialog, ConfirmDialogData } from '../../../shared/dialogs/confirm.dialog';
import { QuestionPrompt } from '../../../shared/question-prompt/question-prompt.component';
import { ExamSession } from '../exam-session.service';

@Component({
  imports: [
    FormField,
    FormRoot,
    MatButton,
    MatFormFieldModule,
    MatIcon,
    MatInput,
    MatProgressBar,
    QuestionPrompt,
  ],
  selector: 'loco-exam-question',
  styleUrl: './exam-question.component.scss',
  templateUrl: './exam-question.component.html',
})
export class ExamQuestion {
  protected readonly session = inject(ExamSession);

  private readonly dialog = inject(MatDialog);
  private readonly model = signal({ answer: '' });

  protected readonly form = form(this.model, {
    submission: {
      action: async () => {
        this.session.answer(this.model().answer);
        this.form().reset({ answer: '' });
        this.focusAnswer();
        return null;
      },
    },
  });

  constructor() {
    afterNextRender(() => this.focusAnswer());
  }

  protected async cancel(): Promise<void> {
    const dialogRef = this.dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
      data: {
        title: 'Prüfung abbrechen?',
        message:
          'Deine bisherigen Antworten werden verworfen; es gibt kein Ergebnis. Erfassen und Trainieren sind danach wieder freigegeben.',
        confirmLabel: 'Abbrechen',
        cancelLabel: 'Weiter prüfen',
      },
    });
    if ((await lastValueFrom(dialogRef.afterClosed())) === true) {
      this.session.reset();
    }
  }

  private focusAnswer(): void {
    this.form.answer().focusBoundControl();
  }
}

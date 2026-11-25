import { afterNextRender, Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, readonly, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { QuestionPrompt } from '../../shared/question-prompt/question-prompt.component';
import { TrainingSession } from './training-session.service';

@Component({
  imports: [
    FormField,
    FormRoot,
    MatButton,
    MatFormFieldModule,
    MatIcon,
    MatInput,
    QuestionPrompt,
    RouterLink,
  ],
  selector: 'loco-training',
  styleUrl: './training.component.scss',
  templateUrl: './training.component.html',
})
export class Training {
  protected readonly session = inject(TrainingSession);

  private readonly model = signal({ answer: this.session.result()?.answer ?? '' });

  protected readonly form = form(
    this.model,
    path => {
      required(path.answer, { message: 'Bitte eine Antwort eingeben.' });
      readonly(path.answer, { when: () => this.session.result() !== undefined });
    },
    {
      submission: {
        action: async () => {
          this.checkOrContinue();
          return null;
        },
      },
    },
  );

  constructor() {
    afterNextRender(() => this.focusAnswer());
  }

  private checkOrContinue(): void {
    if (this.session.result()) {
      this.session.next();
      this.form().reset({ answer: '' });
    } else {
      this.session.check(this.model().answer);
    }
    this.focusAnswer();
  }

  private focusAnswer(): void {
    this.form.answer().focusBoundControl();
  }
}

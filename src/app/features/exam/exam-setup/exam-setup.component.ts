import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, max, min, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { TermService } from '../../../term/term.service';
import { ExamSession, requiredCorrect } from '../exam-session.service';

@Component({
  imports: [
    FormField,
    FormRoot,
    MatButton,
    MatFormFieldModule,
    MatIcon,
    MatInput,
    MatSlider,
    MatSliderThumb,
  ],
  selector: 'loco-exam-setup',
  styleUrl: './exam-setup.component.scss',
  templateUrl: './exam-setup.component.html',
})
export class ExamSetup {
  protected readonly available = inject(TermService).wordPairs().length;

  private readonly session = inject(ExamSession);
  private readonly model = signal<{ limit: number | null; passRate: number }>({
    limit: this.available,
    passRate: 80,
  });

  protected readonly form = form(
    this.model,
    path => {
      required(path.limit, { message: 'Bitte eine Anzahl eingeben.' });
      min(path.limit, 1, { message: 'Mindestens 1 Wort.' });
      max(path.limit, this.available, { message: `Höchstens ${this.available} Wörter.` });
    },
    {
      submission: {
        action: async () => {
          const { limit, passRate } = this.model();
          this.session.start({ limit: limit ?? this.available, passRate });
        },
      },
    },
  );

  protected readonly requiredCorrectAnswers = computed(() => {
    const { limit, passRate } = this.model();
    if (limit === null || !this.form.limit().valid()) {
      return undefined;
    }
    return requiredCorrect(limit, passRate);
  });
}

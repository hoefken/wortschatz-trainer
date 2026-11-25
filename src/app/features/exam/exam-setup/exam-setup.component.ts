import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, max, min, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { TermService } from '../../../terms/term.service';
import { ExamSession, requiredCorrect } from '../exam-session';

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
  private readonly model = signal<{ count: number | null; passRate: number }>({
    count: this.available,
    passRate: 80,
  });

  protected readonly form = form(
    this.model,
    path => {
      required(path.count, { message: 'Bitte eine Anzahl eingeben.' });
      min(path.count, 1, { message: 'Mindestens 1 Wort.' });
      max(path.count, this.available, { message: `Höchstens ${this.available} Wörter.` });
    },
    {
      submission: {
        action: async () => {
          const { count, passRate } = this.model();
          this.session.start({ limit: count ?? this.available, passRate });
          return null;
        },
      },
    },
  );

  protected readonly passThreshold = computed(() => {
    const { count, passRate } = this.model();
    return this.form.count().valid() && count ? requiredCorrect(count, passRate) : undefined;
  });
}

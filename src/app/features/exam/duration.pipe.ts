import { Pipe, PipeTransform } from '@angular/core';

const MAX_SECONDS = 60 * 60;

/**
 * Formatiert eine Dauer in Millisekunden als `m:ss`, auf ganze Sekunden gerundet.
 * Über 60 Minuten steht nur „mehr als 60 Minuten“.
 *
 * Sobald das Projekt auf ES2025 zielt, kann die Pipe durch `Intl.DurationFormat`
 * ersetzt werden (`lib.es2025.intl`, z. B. `style: 'digital'`). Die API ist erst seit
 * 2025 in allen großen Browsern verfügbar und damit noch nicht „Baseline widely
 * available“, die Browser-Unterstützung, die Angular standardmäßig zusichert.
 */
@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(milliseconds: number): string {
    const seconds = Math.round(milliseconds / 1000);
    if (seconds > MAX_SECONDS) {
      return 'mehr als 60 Minuten';
    }
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }
}

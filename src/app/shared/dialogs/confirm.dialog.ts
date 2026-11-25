import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';

export interface ConfirmDialogData {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  readonly cancelLabel?: string;
}

@Component({
  imports: [MatButton, MatDialogModule],
  selector: 'loco-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions>
      <button matButton mat-dialog-close>{{ data.cancelLabel ?? 'Abbrechen' }}</button>
      <button matButton="filled" class="danger" [mat-dialog-close]="true">
        {{ data.confirmLabel }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}

export async function confirm(dialog: MatDialog, data: ConfirmDialogData): Promise<boolean> {
  const dialogRef = dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
    data,
  });
  return (await lastValueFrom(dialogRef.afterClosed())) === true;
}

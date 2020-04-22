import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  ok: boolean;
  message: string;

  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    this.ok = false;
    this.message = 'confirmation';
  }

  confirm(): void {
    this.ok = true;
    this.close();
  }

  close(): void {
    this.dialogRef.close(this.ok);
  }

}

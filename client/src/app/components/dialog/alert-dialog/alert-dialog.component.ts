import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {

  message: string;

  constructor(private dialogRef: MatDialogRef<AlertDialogComponent>) {
    this.message = 'Erreur';
  }

  close(): void {
    this.dialogRef.close();
  }
}

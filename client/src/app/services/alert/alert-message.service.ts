import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { AlertDialogComponent } from 'src/app/components/dialog/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AlertMessageService {

  private dialogRefAlert: MatDialogRef<AlertDialogComponent>;

  constructor(public dialog: MatDialog) { }

  showPopUp(message: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    this.dialogRefAlert = this.dialog.open(AlertDialogComponent, dialogConfig);
    this.dialogRefAlert.componentInstance.message = message;
  }
}

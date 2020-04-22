import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColorToolVariables } from 'src/app/classes/color-tool-variables';
import { NewWorkZone } from 'src/app/classes/new-work-zone';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { ColorService } from 'src/app/services/color/color.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CDZ, MESSAGE } from './enum';

@Component({
  selector: 'app-create-drawing-dialog',
  templateUrl: './create-drawing-dialog.component.html',
  styleUrls: ['./create-drawing-dialog.component.scss']
})

export class CreateDrawingDialogComponent implements OnInit {
  private colorVariables: ColorToolVariables;
  private newWorkZone: NewWorkZone;
  private listening: boolean;
  private commingFromMenu: boolean;
  private dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;

  @ViewChild('valRHex', { static: false })
  valRHex: ElementRef;

  @ViewChild('valGHex', { static: false })
  valGHex: ElementRef;

  @ViewChild('valBHex', { static: false })
  valBHex: ElementRef;
  constructor(private dialogRef: MatDialogRef<CreateDrawingDialogComponent>,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data: boolean,
              public dialog: MatDialog,
              private colorService: ColorService,
              private alert: AlertMessageService) {
      this.commingFromMenu = data;
      this.colorVariables = new ColorToolVariables();
      this.newWorkZone = new NewWorkZone();
      this.listening = true;
      this.colorVariables.hideColorPicker = true;
  }

  ngOnInit(): void {
    this.newWorkZone.width = window.innerWidth - CDZ.INNERWIDTH;
    this.newWorkZone.height = window.innerHeight - CDZ.INNERHEIGHT;
    this.colorService.backgroundColor = 'rgba(255,255,255,1)';
    this.newWorkZone.validation = false;
  }

  @HostListener('window:resize', ['$event'])
  // tslint:disable-next-line: no-any
  onResize(event: any): void {
    if (this.listening) {
      this.newWorkZone.width = event.currentTarget.innerWidth - CDZ.INNERWIDTH;
      this.newWorkZone.height = event.currentTarget.innerHeight - CDZ.INNERHEIGHT;
    }
  }

  notListening(): void {
    this.listening = false;
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * *
  *   Validation function
  * * * * * * * * * * * * * * * * * * * * * * * * * * */
  isNormalInteger(): boolean {
    const downW = Math.floor(this.newWorkZone.width);
    const upW = Math.ceil(this.newWorkZone.width);
    const downH = Math.floor(this.newWorkZone.height);
    const upH = Math.ceil(this.newWorkZone.height);
    return downW === upW && downH === upH;
  }

  validateColorEntered(): void {
    const rdecimal = parseInt(this.valRHex.nativeElement.value, 16);
    const gdecimal = parseInt(this.valGHex.nativeElement.value, 16);
    const bdecimal = parseInt(this.valBHex.nativeElement.value, 16);
    if (this.checkHex(rdecimal) && this.checkHex(gdecimal) && this.checkHex(bdecimal)) {
      this.colorVariables.color = 'rgba(' + rdecimal + ',' + gdecimal + ',' + bdecimal + ',1)';
    } else {
      this.alert.showPopUp(MESSAGE.MUST_BE_HEXA);
    }
    this.saveBackgroundColor();
  }

  checkHex(x: number): boolean {
    return x < CDZ.MAXHEX && x > 0;
  }

  validCanvas(): boolean {
    const validWidth =  this.newWorkZone.width >= CDZ.MINWIDTHHEIGHT && this.newWorkZone.width <= CDZ.MAXWIDTHHEIGHT;
    const validHeight = this.newWorkZone.height >= CDZ.MINWIDTHHEIGHT && this.newWorkZone.height <= CDZ.MAXWIDTHHEIGHT;
    return validWidth && validHeight;
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * *
  *   Button action function
  * * * * * * * * * * * * * * * * * * * * * * * * * * */
  save(): void {
    this.notListening();
    if (!this.isNormalInteger()) {
      this.alert.showPopUp(MESSAGE.MUST_BE_INT);
      return;
    }
    if (!this.validCanvas()) {
      this.alert.showPopUp(MESSAGE.WIDHT_HEIGT_ERRROR);
      return;
    }
    if (localStorage.getItem(AUTOSAVE.LOCATION)) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '300px';
      this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
      this.dialogRefConfirm.componentInstance.message = MESSAGE.OVERWRITE_DRAWING;
      this.dialogRefConfirm.afterClosed().subscribe(
        (confirm: boolean) => {
          if (confirm) {
            this.dialogRef.close(this.newWorkZone);
          } else {
            this.close();
          }
        }
      );
    } else {
      this.dialogRef.close(this.newWorkZone);
    }
  }

  close(): void {
    this.notListening();
    this.dialogRef.close();
    if (this.commingFromMenu) {
      this.router.navigate(['']);
    }
  }

  saveBackgroundColor(): void {
    if (this.colorVariables.color) {
      console.log('entrer');
      this.colorService.backgroundColor = this.colorVariables.color;
      this.colorService.addColor(this.colorVariables.color, false);
    }
  }

}

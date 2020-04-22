import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements AfterViewInit {

  @ViewChild('svgConainter', {static: true}) targetCanvas: ElementRef;

  img: HTMLImageElement;
  showOldDrawing: boolean;
  private dialogRefDelete: MatDialogRef<ConfirmDialogComponent>;

  constructor(private router: Router, public dialog: MatDialog) {
    if (localStorage.getItem(AUTOSAVE.LOCATION)  !== null) {
      this.showOldDrawing = true;
    } else {
      this.showOldDrawing = false;
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Check if a drawing is save localy. If so call the fonction to preview it
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  ngAfterViewInit(): void {
    if (localStorage.getItem(AUTOSAVE.LOCATION)  !== null) {
      this.svgToCanvas();
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * New drawing when hotkey ctrl + O
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  @HostListener('window:keydown', ['$event'])
  hotKeysDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'o') {
      this.newDrawing();
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Select the svg and import it into the preview
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  svgToCanvas(): void {
    this.img = new Image();
    const oParser = new DOMParser();
    // tslint:disable-next-line: no-non-null-assertion
    const oDOM = oParser.parseFromString(localStorage.getItem(AUTOSAVE.LOCATION)!, 'application/xml');
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(oDOM));
    this.img.src = url;
    this.img.onload =  () => {
      const ctx = this.targetCanvas.nativeElement.getContext('2d');
      ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.targetCanvas.nativeElement.width,
      this.targetCanvas.nativeElement.height);
    };
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Confirm for deleting the old drawing and go to draw zone
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  newDrawing(): void {
    if (localStorage.getItem(AUTOSAVE.LOCATION)  !== null) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '300px';
      this.dialogRefDelete = this.dialog.open(ConfirmDialogComponent, dialogConfig);
      this.dialogRefDelete.componentInstance.message = 'Une dessin est présent dans la zone de dessin, voulez-vous le remplacer ?';
      this.dialogRefDelete.afterClosed().subscribe(
      (ok: boolean) => {
          if (ok === true) {
            localStorage.removeItem(AUTOSAVE.LOCATION);
            this.router.navigateByUrl('/workzone');
          }
        }
      );
    } else {
      this.router.navigateByUrl('/workzone');
    }
  }

}

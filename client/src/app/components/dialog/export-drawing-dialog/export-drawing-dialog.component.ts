import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { QueriesService } from 'src/app/services/serverInteraction/queries.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EXPORT, ExportInfo, FILTER, FORMAT, MESSAGE, VERIF } from './enum';

@Component({
  selector: 'app-export-drawing-dialog',
  templateUrl: './export-drawing-dialog.component.html',
  styleUrls: ['./export-drawing-dialog.component.scss']
})
export class ExportDrawingDialogComponent implements OnInit {

  att: ExportInfo;
  private dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;

  @ViewChild('svgConainter', {static: true}) targetCanvas: ElementRef;

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Constructor and attribute declaration
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  constructor(private dialogRef: MatDialogRef<ExportDrawingDialogComponent>,
              private dispatcherService: ClickEventDispatcherService,
              private alert: AlertMessageService,
              public dialog: MatDialog,
              private renderer: Renderer2,
              private queriesService: QueriesService) {
    this.att = new ExportInfo();
    this.att.filter = FILTER.NONE;
    this.att.format = FORMAT.SVG;
    this.att.exportMethode = EXPORT.DOWNLOAD;
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Import image to base64 and display image in the canvas
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  ngOnInit(): void {
    if (localStorage.getItem(AUTOSAVE.LOCATION) !== null) {
      // tslint:disable-next-line: no-non-null-assertion
      this.att.serializeSVG = localStorage.getItem(AUTOSAVE.LOCATION)!; // Null teste juste au dessus
      const blob = new Blob([this.att.serializeSVG], {type: 'image/svg+xml'}) as File;
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          this.att.base64data = reader.result as string;
          resolve();
        };
      }).then(() => {
        const img = new Image();
        const url = this.att.base64data;
        img.src = url;
        img.onload =  () => {
          const ctx = this.targetCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.targetCanvas.nativeElement.width,
          this.targetCanvas.nativeElement.height);
        };
      });
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Applied filter to the canvas preview
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  appliedFilter(filter: string): void {
    const img = new Image();
    img.src = this.att.base64data;
    img.onload =  () => {
      const ctx = this.targetCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.targetCanvas.nativeElement.width,
      this.targetCanvas.nativeElement.height);
    };
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Dowload the drawing in the format checked and close the window
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  save(): void {
    const validName = new RegExp(VERIF.NAME);
    if (!validName.test(this.att.drawingName)) {
      this.alert.showPopUp(MESSAGE.NAME_NOT_VALID);
      return;
    }
    if (this.att.exportMethode === EXPORT.EMAIL) {
      const validEmail = new RegExp(VERIF.EMAIL);
      if (!validEmail.test(this.att.email)) {
        this.alert.showPopUp(MESSAGE.EMAIL_NOT_VALID);
        return;
      }
    }
    if (this.att.format === FORMAT.SVG) {
      this.exportSVGFile();
    } else {
      this.exportPNGorJPG();
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Get the svg from canvas and send the data to be download
  * Inspirer de : https://stackoverflow.com/questions/28226677/save-inline-svg-as-jpeg-png-svg
  * format -> 'png' OR 'jpg'
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  exportPNGorJPG(): void {
    // Get the drawing
    const canvas = this.targetCanvas.nativeElement;
    // Applied the orininal size
    const bounding = this.dispatcherService.canvas.getBoundingClientRect();
    canvas.width = bounding.width;
    canvas.height = bounding.height;
    // Applied the good filter
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.filter = this.att.filter;
    const img = new Image();
    img.src = this.att.base64data;
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const imgURL = ctx.canvas.toDataURL('image/' + this.att.format).replace('image/' + this.att.format, 'image/octet-stream');
      if (this.att.exportMethode === EXPORT.DOWNLOAD) {
        this.downloadFile(imgURL, this.att.format);
      } else {
        this.sendFile(imgURL, this.att.format);
      }
    };
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Return a copie of the original canvas with the style filter applied
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  getCloneWithFilter(): Node {
    // Value to reset the canvas to the good style after alteration
    const backgroundColor =  'background: ' + this.dispatcherService.canvas.style.backgroundColor;
    const filter = 'filter: ' + this.att.filter + ';' + backgroundColor;
    // Applied filter and copie the canvas
    this.renderer.setAttribute(this.dispatcherService.canvas, 'style', filter);
    const nodeCopie = this.dispatcherService.canvas.cloneNode(true);
    // Set back the canvas
    this.renderer.setAttribute(this.dispatcherService.canvas, 'style', backgroundColor);
    return nodeCopie;
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Download the image in .SVG format
  * Inspirer de: https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  exportSVGFile(): void {
    // First create a clone of our svg node so we don't mess the original one
    const clone = this.getCloneWithFilter();
    // Create a doctype
    const svgDocType = document.implementation.createDocumentType('svg',
    '-//W3C//DTD SVG 1.1//EN', 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd');
    // Fresh svg document
    const svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
    // Replace the documentElement with our clone
    svgDoc.replaceChild(clone, svgDoc.documentElement);
    // svg to string
    const svgData = (new XMLSerializer()).serializeToString(svgDoc);
    if (this.att.exportMethode === EXPORT.DOWNLOAD) {
      const imgURL = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData.replace(/></g, '>\n\r<'));
      this.downloadFile(imgURL, this.att.format);
    } else {
      this.sendFile(svgData, this.att.format);
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Download the image in .PNG or .JPG format
  * Inspirer de : https://stackoverflow.com/questions/28226677/save-inline-svg-as-jpeg-png-svg
  * format -> 'png' OR 'jpg' OR 'svg'
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  downloadFile(imgURL: string, format: string ): void {
    const evt = new MouseEvent('click', {
      view: window,
      bubbles: false,
      cancelable: true
    });
    const a = document.createElement('a');
    a.setAttribute('download', this.att.drawingName + '.' + format);
    a.setAttribute('href', imgURL);
    a.dispatchEvent(evt);
    this.close();
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Send file by email
  * format -> 'png' OR 'jpg' OR 'svg'
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  sendFile(data: string, format: string ): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '300px';
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    this.dialogRefConfirm.componentInstance.message = MESSAGE.ASK_CONFIRMATION_TO_SEND;
    this.dialogRefConfirm.afterClosed().subscribe(
      (confirm: boolean) => {
        if (confirm) {
          this.queriesService.sendmail(this.att.drawingName, this.att.format , this.att.email, data);
          this.close();
        }
      }
    );
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Close the window
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  close(): void {
    this.dialogRef.close();
  }

}

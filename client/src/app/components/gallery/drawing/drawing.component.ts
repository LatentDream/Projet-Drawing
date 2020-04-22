import { Component, ElementRef, Input, OnChanges, Optional, Renderer2, RendererFactory2, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { QueriesService } from 'src/app/services/serverInteraction/queries.service';
import { Drawing } from '../../../../../../common/communication/drawing';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { GalleryComponent } from '../gallery.component';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})
export class DrawingComponent implements OnChanges {

  @Input() info: Drawing;
  @ViewChild('svgConainter', {static: true}) targetCanvas: ElementRef;
  img: HTMLImageElement;
  renderer: Renderer2;
  private dialogRefDelete: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private queriesService: QueriesService, private rendererFactory: RendererFactory2,
    public dialog: MatDialog,
    private router: Router,
    @Optional() public myParent: GalleryComponent
    ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.info = { _id: '', name: '', tags: [], drawing: ''};
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Set the drawing info to the preview
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  ngOnChanges(changes: SimpleChanges): void {
    this.svgToCanvas();
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Load the drawing to the preview canvas
  *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  svgToCanvas(): void {
    this.img = new Image();
    const oParser = new DOMParser();
    const oDOM = oParser.parseFromString(this.info.drawing, 'application/xml');
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(oDOM));
    this.img.src = url;
    this.img.onload =  () => {
      const ctx = this.targetCanvas.nativeElement.getContext('2d');
      ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.targetCanvas.nativeElement.width,
      this.targetCanvas.nativeElement.height);
    };
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Load the drawing to the drawing-zone
  *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  loadToDrawingZone(): void {
    if (localStorage.getItem(AUTOSAVE.LOCATION) !== null) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '300px';
      this.dialogRefDelete = this.dialog.open(ConfirmDialogComponent, dialogConfig);
      this.dialogRefDelete.componentInstance.message = 'Une dessin est présent dans la zone de dessin, voulez-vous le remplacer ?';
      this.dialogRefDelete.afterClosed().subscribe(
      (data) => {
        if (data === true) {
          localStorage.setItem(AUTOSAVE.LOCATION, this.info.drawing);
          this.router.navigateByUrl('/workzone');
        }
      }
    );
    } else {
      localStorage.setItem(AUTOSAVE.LOCATION, this.info.drawing);
      this.router.navigateByUrl('/workzone');
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Delete a specific drawing localy and remotly
  *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  delete(): void {
    // Confirm dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '300px';
    this.dialogRefDelete = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    this.dialogRefDelete.componentInstance.message = 'Êtes-vous certain de vouloir supprimer ce dessin ?';
    this.dialogRefDelete.afterClosed().subscribe(
      (data) => {
        if (data) {
          // Delete from server
          this.queriesService.deleteDrawing(this.info._id.toString())
          .then( (value) => {
            this.myParent.deleteDrawingLocaly(this.info._id.toString());
          })
          .catch( (err: Error) => {
            alert('impossible de suprimer le dessin!');
          });
        }
      }
    );
  }

}

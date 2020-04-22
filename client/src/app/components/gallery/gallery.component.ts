import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { MatChipInputEvent } from '@angular/material/chips';
import { QueriesService } from 'src/app/services/serverInteraction/queries.service';
import { Drawing } from '../../../../../common/communication/drawing';
import { AlertDialogComponent } from '../dialog/alert-dialog/alert-dialog.component';
import { Tag } from '../dialog/save-drawing-dialog/save-drawing-dialog.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  // Drawings attribute
  drawingsData: Drawing[];
  loading: boolean;

  // Search attribute
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  backupDrawingsData: Drawing[];
  removable: boolean;
  drawingName: string;
  tags: Tag[];

  // Alert pop up
  private dialogRefAlert: MatDialogRef<AlertDialogComponent>;

  constructor(private queriesService: QueriesService, private location: Location, public dialog: MatDialog) {
    this.removable = true;
    this.loading = true;
    this.tags = [];
    this.drawingsData = [];
    this.backupDrawingsData = [];
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Receive the drawing from the server
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  ngOnInit(): void {
    this.queriesService.getAllDrawings().subscribe((drawings: Drawing[]) => {
      this.loading = false;
      this.drawingsData = drawings;
      this.backupDrawingsData = drawings;
      // Remove Test drawing
      for (const drawing of drawings) {
        if (drawing._id === 'anid') {
          this.deleteDrawingLocaly(drawing._id);
        }
      }
    });
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Remove all drawing preview
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  emptyDrawing(): void {
    this.drawingsData = [];
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Add drawings that contain at least one tags
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  filter(tag: string): void {
    for (const drawing of this.backupDrawingsData) {
      if (drawing.tags.includes(tag)) {
        if (!this.drawingsData.includes(drawing)) {
          this.drawingsData.push(drawing);
        }
      }
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Add a search tag and update the preview's view
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const reg = new RegExp('^[\\w]{1,20}$');
      if (!reg.test(value.trim())) {
        this.openAlert('Entrée invalide. Longueur minimum de 1 et maximale de 20. Nutilisez que les caractères a-Z, 1-9 ou _');
      } else {
        if (this.tags.length === 0) {
          this.emptyDrawing();
        }
        this.tags.push({name: value.trim()});
        this.filter(value.trim());
        if (this.drawingsData.length === 0) {
          this.openAlert('Auncun dessin trouvé !');
        }
      }
    }
    input.value = '';

  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Remove the tag and update all the preview's view
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  remove(tag: Tag): void {
    // Remove tag
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    } else {
      return;
    }
    // Remove drawing
    for (const drawing of this.drawingsData) {
      let toRemove = true;
      for (const t of this.tags) {
        if (drawing.tags.includes(t.name)) {
          toRemove = false;
        }
      }
      if (toRemove) {
        this.drawingsData.splice(this.drawingsData.indexOf(drawing), 1);
        if (this.drawingsData.length === 0) {
          this.openAlert('Auncun dessin trouvé !');
        }
      }
    }

    if (this.tags.length === 0) {
      this.drawingsData = this.backupDrawingsData;
    }
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Go back to the previous page
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  backPage(): void {
    this.location.back();
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Open a alert dialog with a specific message
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  openAlert(message: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '300px';
    this.dialogRefAlert = this.dialog.open(AlertDialogComponent, dialogConfig);
    this.dialogRefAlert.componentInstance.message = message;
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Delete a image localy and remove the associate preview
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  deleteDrawingLocaly(id: string): void {
    for (const drawing of this.backupDrawingsData) {
      if (drawing._id === id) {
        this.backupDrawingsData.splice(this.backupDrawingsData.indexOf(drawing), 1);
        const index = this.drawingsData.indexOf(drawing);
        if (index >= 0) {
          this.drawingsData.splice(index, 1);
        }
      }
    }
  }

}

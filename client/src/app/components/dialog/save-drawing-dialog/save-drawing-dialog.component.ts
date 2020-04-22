import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { QueriesService } from '../../../services/serverInteraction/queries.service';

export interface Tag {
  name: string;
}

@Component({
  selector: 'app-save-drawing-dialog',
  templateUrl: './save-drawing-dialog.component.html',
  styleUrls: ['./save-drawing-dialog.component.scss']
})

export class SaveDrawingDialogComponent implements OnInit {

  removable: boolean;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  drawingName: string;
  tags: Tag[] = [];
  srxCanvas: string;
  loading: boolean;
  @ViewChild('svgConainter', {static: true}) targetCanvas: ElementRef;

  constructor(private dialogRef: MatDialogRef<SaveDrawingDialogComponent>,
              private queriesService: QueriesService) {
      this.loading = false;
      this.removable = true;
    }

  ngOnInit(): void {
    if (localStorage.getItem(AUTOSAVE.LOCATION)) {
      // Get drawing for local storage
      this.srxCanvas = localStorage.getItem(AUTOSAVE.LOCATION) as string;
      // Remove drawing from local storage
      localStorage.removeItem(AUTOSAVE.LOCATION);
      // Display the preview
      const img = new Image();
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(this.srxCanvas);
      img.src = url;
      img.onload =  () => {
        const ctx = this.targetCanvas.nativeElement.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.targetCanvas.nativeElement.width,
        this.targetCanvas.nativeElement.height);
      };
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const reg = new RegExp('^[\\w]{1,20}$');
      if (!reg.test(value.trim())) {
        alert('Entrée invalide. Longueur minimum de 1 et maximale de 20. Nutilisez que les caractères a-Z, 1-9 ou _');
      } else {
        this.tags.push({name: value.trim()});
      }
    }
    // Clear the input
    input.value = '';
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  save(): void {
    this.loading = true;
    const reg = new RegExp('^[\\w]{1,20}$');
    if (!reg.test(this.drawingName)) {
      alert('Le nom du dessin est invalide. Longueur minimum de 1 et maximale de 20. Nutilisez que les caractères a-Z, 1-9 ou _');
    } else {
      const currentTags: string[] = [];

      this.tags.forEach( (element) => {
        currentTags.push(element.name);
      });
      this.loading = true;
      this.queriesService.sendDrawingData(this.drawingName, currentTags, this.srxCanvas)
      .then( (value) => {
        console.log(value);
        this.loading = false;
        this.dialogRef.close();
      }).catch((err) => {
        console.log(err);
        alert('erreur de connection avec le serveur');
        this.loading = false;
      });
    }
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

}

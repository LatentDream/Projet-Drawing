import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { AutoSaveService } from 'src/app/services/auto-save/auto-save.service';
import { ColorService } from 'src/app/services/color/color.service';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { TextureService } from 'src/app/services/texture/texture.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import { CreateDrawingDialogComponent } from '../dialog/create-drawing-dialog/create-drawing-dialog.component';

@Component({
  selector: 'app-draw-zone',
  templateUrl: './draw-zone.component.html',
  styleUrls: ['./draw-zone.component.scss']
})
export class DrawZoneComponent implements OnInit {

  @ViewChild('drawView', { static: true }) drawView: ElementRef<HTMLElement>;
  private dialogRefCreate: MatDialogRef<CreateDrawingDialogComponent>;

  constructor(private clickEventDispatcher: ClickEventDispatcherService,
              public dialog: MatDialog,
              private renderer: Renderer2,
              private colorService: ColorService,
              private undoRedo: UndoRedoService,
              private autoSave: AutoSaveService,
              private textureService: TextureService) {}

  ngOnInit(): void {
    if (localStorage.getItem(AUTOSAVE.LOCATION) != null) {
      this.resumeDrawing();
    } else {
      this.openDialogCreateDrawZone(true);
    }
  }

  resumeDrawing(): void {
    if (this.clickEventDispatcher.canvas != null) {
      this.renderer.removeChild(this.drawView.nativeElement, this.clickEventDispatcher.canvas);
    }
    const oParser = new DOMParser();
    // tslint:disable-next-line: no-non-null-assertion
    const oDOM = oParser.parseFromString(localStorage.getItem(AUTOSAVE.LOCATION)!, 'application/xml');
    this.clickEventDispatcher.canvas = oDOM.documentElement as Element as SVGElement;
    this.renderer.appendChild(this.drawView.nativeElement, this.clickEventDispatcher.canvas);
    this.undoRedo.setElement(this.drawView.nativeElement.children[0]);
    this.undoRedo.enable();
    this.autoSave.setElement(this.drawView.nativeElement.children[0]);
    this.clickEventDispatcher.isDrawingBlank = true;
    const canvas = this.renderer.createElement('canvas');
    const value = 275;
    const ten = 10;
    canvas.width = (window.innerWidth - value).toString();
    canvas.height = (window.innerHeight - ten).toString();
  }

  openDialogCreateDrawZone(comingfromMenu: boolean): void {
    // Block the hotkeys
    this.clickEventDispatcher.popUpActive = true;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '250px';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = comingfromMenu;

    this.dialogRefCreate = this.dialog.open(CreateDrawingDialogComponent, dialogConfig);

    this.dialogRefCreate.afterClosed().subscribe(
      (data) => {
        if (data != null) {
          if (this.clickEventDispatcher.canvas != null) {
            this.renderer.removeChild(this.drawView.nativeElement, this.clickEventDispatcher.canvas);
          }
          this.clickEventDispatcher.canvas = this.renderer.createElement('svg', 'http://www.w3.org/2000/svg');
          this.renderer.setAttribute(this.clickEventDispatcher.canvas, 'width', data.width.toString());
          this.renderer.setAttribute(this.clickEventDispatcher.canvas, 'height', data.height.toString());
          this.renderer.setAttribute(this.clickEventDispatcher.canvas, 'style', 'background: '.concat(this.colorService.backgroundColor));
          this.renderer.setAttribute(this.clickEventDispatcher.canvas, 'class', 'canvas');
          this.renderer.setAttribute(this.clickEventDispatcher.canvas, 'xmlns', 'http://www.w3.org/2000/svg');
          this.renderer.appendChild(this.drawView.nativeElement, this.clickEventDispatcher.canvas);
          this.renderer.appendChild(this.clickEventDispatcher.canvas, this.textureService.filterBase);
          this.renderer.appendChild(this.clickEventDispatcher.canvas, this.textureService.filterBlurry);
          this.renderer.appendChild(this.clickEventDispatcher.canvas, this.textureService.filterNoise);
          this.renderer.appendChild(this.clickEventDispatcher.canvas, this.textureService.filterSquigly);
          this.renderer.appendChild(this.clickEventDispatcher.canvas, this.textureService.filterTurbulence);
          this.undoRedo.setElement(this.drawView.nativeElement.children[0]);
          this.undoRedo.enable();
          this.autoSave.setElement(this.drawView.nativeElement.children[0]);
          this.clickEventDispatcher.isDrawingBlank = true;
        }
        this.clickEventDispatcher.popUpActive = false;
      }
    );
}

@HostListener('document:keydown.control.o', ['$event'])
hotkeyNewDrawing(event: KeyboardEvent): void {
  event.preventDefault();
  if (!this.clickEventDispatcher.popUpActive) {
    this.openDialogCreateDrawZone(false);
  }
}
mouseDown(event: MouseEvent): void {
  this.clickEventDispatcher.mouseDown(event);
}

mouseMove(event: MouseEvent): void {
  this.clickEventDispatcher.mouseMove(event);
}

mouseUp(event: MouseEvent): void {
  this.clickEventDispatcher.mouseUp(event);
}

mouseLeave(): void {
  this.clickEventDispatcher.mouseLeave();
}

mouseClick(event: MouseEvent): void {
  this.clickEventDispatcher.mouseClick(event);
}

mouseDbClick(event: MouseEvent): void {
  this.clickEventDispatcher.mouseDbClick(event);
}

mouseRightDown(event: MouseEvent): boolean {
  // Return false to prevent showing the context menu
  return false;
}
}

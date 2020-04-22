import { Component, HostListener, OnInit } from '@angular/core';
import { MatButtonToggleChange, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AutoSaveService } from 'src/app/services/auto-save/auto-save.service';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { TextService } from 'src/app/services/text/text.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import { ExportDrawingDialogComponent } from '../dialog/export-drawing-dialog/export-drawing-dialog.component';
import { SaveDrawingDialogComponent } from '../dialog/save-drawing-dialog/save-drawing-dialog.component';
import { KEY, TOOLS } from '../enum';

@Component({
  selector: 'app-draw-menu',
  templateUrl: './draw-menu.component.html',
  styleUrls: ['./draw-menu.component.scss']
})
export class DrawMenuComponent implements OnInit {

  buttonToggleValue: string;
  private toolBinding: Map<string, string>;
  private buttonValue: Map<string, string>;
  private serviceHotkeys: Map<string, string>;

  constructor(private undoRedo: UndoRedoService,
              private clickEventDispatcher: ClickEventDispatcherService,
              public dialog: MatDialog,
              private router: Router,
              private autoSave: AutoSaveService,
              private gridService: GridService,
              private textService: TextService,
              private clipboard: ClipboardService) {
    this.toolBinding = new Map();
    this.buttonValue = new Map();
    this.serviceHotkeys = new Map();
    this.bindTools();
  }

  private dialogRefSave: MatDialogRef<SaveDrawingDialogComponent>;
  private dialogRefExport: MatDialogRef<ExportDrawingDialogComponent>;

  ngOnInit(): void {
    this.buttonToggleValue = TOOLS.DRAW;
    this.clickEventDispatcher.setCurrentTool(TOOLS.PENCIL);
  }

  private bindTools(): void {
    this.toolBinding.set(TOOLS.DRAW, TOOLS.PENCIL)
      .set(TOOLS.SHAPE, TOOLS.RECT)
      .set(TOOLS.LINE, TOOLS.LINE)
      .set(TOOLS.TEXT, TOOLS.TEXT)
      .set(TOOLS.COLOR, TOOLS.BUCKET)
      .set(TOOLS.ERASER, TOOLS.ERASER)
      .set(TOOLS.APPLICATOR, TOOLS.APPLICATOR)
      .set(TOOLS.SPRAY, TOOLS.SPRAY)
      .set(TOOLS.GRID, TOOLS.GRID)
      .set(TOOLS.SELECTOR, TOOLS.SELECTOR)
      .set(KEY.C, TOOLS.PENCIL)
      .set(KEY.L, TOOLS.LINE)
      .set(KEY.W, TOOLS.BRUSH)
      .set(KEY.E, TOOLS.ERASER)
      .set(KEY.R, TOOLS.APPLICATOR)
      .set(KEY.STR1, TOOLS.RECT)
      .set(KEY.STR2, TOOLS.ELLIPSE)
      .set(KEY.STR3, TOOLS.POLYGON)
      .set(KEY.I, TOOLS.DROPPER)
      .set(KEY.A, TOOLS.SPRAY)
      .set(KEY.T, TOOLS.TEXT)
      .set(KEY.B, TOOLS.BUCKET)
      .set(KEY.S, TOOLS.SELECTOR)
      .set(KEY.P, TOOLS.FEATHER);

    this.buttonValue.set(KEY.C, TOOLS.DRAW)
      .set(KEY.L, TOOLS.LINE)
      .set(KEY.W, TOOLS.DRAW)
      .set(KEY.R, TOOLS.COLOR)
      .set(KEY.STR1, TOOLS.SHAPE)
      .set(KEY.STR2, TOOLS.SHAPE)
      .set(KEY.STR3, TOOLS.SHAPE)
      .set(KEY.I, TOOLS.COLOR)
      .set(KEY.A, TOOLS.DRAW)
      .set(KEY.E, TOOLS.ERASER)
      .set(KEY.T, TOOLS.TEXT)
      .set(KEY.B, TOOLS.COLOR)
      .set(KEY.S, TOOLS.SELECTOR)
      .set(KEY.P, TOOLS.DRAW);
    this.serviceHotkeys.set(KEY.SHIFT, KEY.SHIFT)
      .set(KEY.BACKSPACE, KEY.BACKSPACE)
      .set(KEY.ESCAPE, KEY.ESCAPE)
      .set(KEY.ENTER, KEY.ENTER)
      .set(KEY.DELETE, KEY.DELETE)
      .set(KEY.LEFT_ARROW, KEY.LEFT_ARROW)
      .set(KEY.RIGHT_ARROW, KEY.RIGHT_ARROW)
      .set(KEY.UP_ARROW, KEY.UP_ARROW)
      .set(KEY.DOWN_ARROW, KEY.DOWN_ARROW);
  }

  // tslint:disable-next-line: cyclomatic-complexity
  @HostListener('window:keydown', ['$event'])
  hotKeysDown(event: KeyboardEvent): void {
    if (!this.clickEventDispatcher.popUpActive) {
      if (this.toolBinding.has(event.key) && !this.textService.isText && !event.ctrlKey) {
          this.clickEventDispatcher.setCurrentTool(this.toolBinding.get(event.key) as string);
          this.buttonToggleValue = this.buttonValue.get(event.key) as string;
        } else if (this.serviceHotkeys.has(event.key)) {
            this.clickEventDispatcher.hotKeysDown(event.key);
        } else if (this.textService.isText) {
          this.textService.write(event);
        }

      // Bindings for general Non-tool events
      if (event.ctrlKey) {
        switch (event.key) {
          case 'z' : {
            this.undoRedo.undo();
            this.clickEventDispatcher.hotKeysDown('Escape');
            break;
          }
          case 'Z': {
            this.undoRedo.redo();
            break;
          }
        }
        if (this.clickEventDispatcher.currentTool === 'selection') {
          this.clipboard.action(event.key);
        }

      } else if (!this.textService.isText) {
        // grid keydown events
        switch (event.key) {
          case 'g': {
            this.gridService.toggleGrid();
            break;
          }
          case '+': {
            this.gridService.increment();
            break;
          }
          case '-': {
            this.gridService.decrement();
            break;
          }
          case 'Delete': {
            if (this.clickEventDispatcher.currentTool === 'selection') { this.clipboard.delete(); }
            break;
          }
        }
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  hotKeysUp(event: KeyboardEvent): void {
    if (!this.clickEventDispatcher.popUpActive) {
      if (this.serviceHotkeys.has(event.key)) {
        this.clickEventDispatcher.hotKeysUp(event.key);
      }
    }
  }

  @HostListener('document:keydown.control.a', ['$event'])
  hotkeySelectAll(event: KeyboardEvent): void {
    event.preventDefault();
    if (!this.clickEventDispatcher.popUpActive) {
      this.clickEventDispatcher.selectAllItems();
    }
  }

  @HostListener('document:keydown.control.s', ['$event'])
  hotkeySaveDrawing(event: KeyboardEvent): void {
    event.preventDefault();
    if (!this.clickEventDispatcher.popUpActive) {
      this.openDialogSaveDrawZone();
    }
  }

  @HostListener('document:keydown.control.e', ['$event'])
  hotkeyExportDrawing(event: KeyboardEvent): void {
    event.preventDefault();
    if (!this.clickEventDispatcher.popUpActive) {
      this.openDialogExportDrawZone();
    }
  }

  @HostListener('document:keydown.control.g', ['$event'])
  hotkeyGallery(event: KeyboardEvent): void {
    event.preventDefault();
    if (!this.clickEventDispatcher.popUpActive) {
      this.autoSave.save();
      this.router.navigateByUrl('/gallery');
    }
  }

  @HostListener('document:mousewheel', ['$event'])
  // tslint:disable-next-line: deprecation
  hotkeyRotateSelection(event: MouseWheelEvent): void {
    event.preventDefault();
    let rotationDirection = 1;
    const fifteen = 15;
    if (!this.clickEventDispatcher.popUpActive) {
      if (event.deltaY < 0) {
        const one = -1;
        rotationDirection = one;
      }
      if (event.altKey && event.shiftKey) {
        this.clickEventDispatcher.rotateSelection(1 * rotationDirection, true);
      } else if (event.altKey) {
        this.clickEventDispatcher.rotateSelection(1 * rotationDirection, false);
      } else if (event.shiftKey) {
        this.clickEventDispatcher.rotateSelection(fifteen * rotationDirection, true);
      } else {
        this.clickEventDispatcher.rotateSelection(fifteen * rotationDirection, false);
      }
    }
  }

  goToUserGuide(): void {
    this.autoSave.save();
    this.router.navigateByUrl('/userguide');
  }

  goToMainMenu(): void {
    this.autoSave.save();
    this.router.navigateByUrl('');
  }

  // Set the current tool when category change
  toolChange(event: MatButtonToggleChange): void {
    if (this.toolBinding.has(event.value)) {
      const textP = 'textParams';
      if (this.clickEventDispatcher.currentTool === 'text' && this.textService[textP].rendering) {
        this.textService.finishEdit();
      }
      this.clickEventDispatcher.setCurrentTool(this.toolBinding.get(event.value) as string);
    }
  }

  openDialogSaveDrawZone(): void {
    this.autoSave.save();
    this.clickEventDispatcher.popUpActive = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    this.dialogRefSave = this.dialog.open(SaveDrawingDialogComponent, dialogConfig);
    this.dialogRefSave.afterClosed().subscribe(
      () => {
        this.clickEventDispatcher.popUpActive = false;
      }
    );
  }

  openDialogExportDrawZone(): void {
    this.autoSave.save();
    this.clickEventDispatcher.popUpActive = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '550px';
    this.dialogRefExport = this.dialog.open(ExportDrawingDialogComponent, dialogConfig);
    this.dialogRefExport.afterClosed().subscribe(
      () => {
        this.clickEventDispatcher.popUpActive = false;
      }
    );
  }

}

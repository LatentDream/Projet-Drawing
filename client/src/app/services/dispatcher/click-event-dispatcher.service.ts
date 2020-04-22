import { Injectable} from '@angular/core';
import { BucketService} from '../bucket/bucket.service';
import {ColorApplicatorService} from '../color-applicator/color-applicator.service';
import { BrushService } from '../drawer/brush/brush.service';
import { FeatherService } from '../drawer/feather/feather.service';
import { PencilService } from '../drawer/pencil/pencil.service';
import { EraseService } from '../erase/erase.service';
import { LineService } from '../line/line.service';
import { PipetteService } from '../pipette/pipette.service';
import { RotationService } from '../selection/rotation.service';
import { SelectionService } from '../selection/selection.service';
import { EllipseService } from '../shape/ellipse/ellipse.service';
import { PolygonService } from '../shape/polygon/polygon.service';
import { RectangleService } from '../shape/rectangle/rectangle.service';
import { SprayService } from '../spray/spray.service';
import { TextService } from '../text/text.service';

@Injectable({
  providedIn: 'root'
})
export class ClickEventDispatcherService {

  currentTool: string;
  itemCount: number;
  isRightClick: boolean;
  popUpActive: boolean; // hot keys are not active during pup up
  canvas: SVGElement;
  isDrawingBlank: boolean;
  mockCEDS: ClickEventDispatcherService;

  constructor(private rectangleService: RectangleService, private lineService: LineService,
              private textService: TextService,  private pencilService: PencilService,
              private brushService: BrushService, private selectionService: SelectionService,
              private ellipseService: EllipseService,  private eraserService: EraseService,
              private colorApplicService: ColorApplicatorService, private rotationService: RotationService,
              private polygonService: PolygonService, private pipetteService: PipetteService,
              private sprayService: SprayService, private bucketService: BucketService,
              private featherService: FeatherService) {
                this.isDrawingBlank = true;
                this.itemCount = 0;
                this.popUpActive = false;
                this.isRightClick = false;
              }

  mouseDown(event: MouseEvent): void {
    this.isDrawingBlank = false;
    switch (this.currentTool) {
      case 'pencil': {
        this.itemCount++;
        this.pencilService.mouseDown(event, this.itemCount);
        break;
      }
      case 'brush': {
        this.itemCount++;
        this.brushService.mouseDown(event, this.itemCount);
        break;
      }
      case 'rectangle': {
        this.itemCount++;
        this.rectangleService.mouseDown(event, this.itemCount);
        break;
      }
      case 'selection': {
        this.selectionService.mouseDown(event, this.canvas);
        break;
      }
      case 'eraser': {
        this.eraserService.mouseDown(event);
        break;
      }
      case 'applicator' : {
        this.colorApplicService.mouseDown(event);
        break;
      }
      case 'feather': {
        this.featherService.mouseDown(event, this.itemCount);
        break;
      }
      case 'ellipse': {
        this.itemCount++;
        this.ellipseService.mouseDown(event, this.itemCount);
        break;
      }
      case 'polygon': {
        this.itemCount++;
        this.polygonService.mouseDown(event, this.itemCount);
        break;
      }
      case 'dropper' : {
        this.pipetteService.mouseDown(event);
        break;
      }
      case 'spray' : {
        this.itemCount++;
        this.sprayService.mouseDown(event, this.itemCount);
        break;
      }
      case 'bucket' : {
        this.bucketService.mouseDown(event, this.itemCount);
        break;
      }
      default:
        break;
    }

  }

  mouseMove(event: MouseEvent): void {
    switch (this.currentTool) {
      case 'pencil': {
        this.pencilService.mouseMove(event);
        break;
      }
      case 'brush': {
        this.brushService.mouseMove(event);
        break;
      }
      case 'rectangle': {
        this.rectangleService.mouseMove(event);
        break;
      }
      case 'line': {
        this.lineService.mouseMove(event);
        break;
      }
      case 'spray' : {
        this.sprayService.mouseMove(event);
        break;
      }
      case 'feather': {
        this.featherService.mouseMove(event);
        break;
      }
      case 'ellipse' : {
        this.ellipseService.mouseMove(event);
        break;
      }
      case 'polygon': {
        this.polygonService.mouseMove(event);
        break;
      }
      case 'eraser': {
        this.eraserService.mouseMove(event);
        break;
      }
      case 'selection': {
        this.selectionService.mouseMove(event, this.canvas);
        break;
      }
      default:
        break;
    }

  }

  mouseUp(event: MouseEvent): void {
    switch (this.currentTool) {
      case 'pencil': {
        this.pencilService.mouseUp(event);
        break;
      }
      case 'brush': {
        this.brushService.mouseUp(event);
        break;
      }
      case 'rectangle': {
        this.rectangleService.mouseUp(event);
        break;
      }
      case 'selection': {
        this.selectionService.mouseUp(event, this.canvas);
        break;
      }
      case 'ellipse' : {
        this.ellipseService.mouseUp(event);
        break;
      }
      case 'polygon': {
        this.polygonService.mouseUp(event);
        break;
      }
      case 'spray' : {
        this.sprayService.mouseUp();
        break;
      }
      case 'eraser': {
        this.eraserService.mouseUp(event);
        break;
      }
      case 'feather': {
        this.featherService.mouseUp(event);
        break;
      }
      default:
        break;
    }
  }

  mouseClick(event: MouseEvent): void {
    this.isDrawingBlank = false;
    switch (this.currentTool) {
      case 'line': {
        this.itemCount++;
        this.lineService.mouseClick(event, this.itemCount);
        break;
      }
      case 'text': {
        this.itemCount++;
        this.textService.mouseClick(event);
        break;
      }
      case 'eraser' : {
        this.eraserService.mouseClick(event);
        break;
      }
      default: {
        break;
      }
    }
  }

  mouseDbClick(event: MouseEvent): void {
    switch (this.currentTool) {
      case 'line': {
        this.lineService.mouseDoubleClick();
        break;
      }
      default: {
        break;
      }
    }
  }

  mouseLeave(): void {
    switch (this.currentTool) {
      case 'pencil': {
        this.pencilService.mouseLeave();
        break;
      }
      case 'brush': {
        this.brushService.mouseLeave();
        break;
      }
      case 'rectangle': {
        this.rectangleService.mouseLeave();
        break;
      }
      case 'eraser': {
        this.eraserService.mouseLeave();
        break;
      }
      case 'ellipse' : {
        this.ellipseService.mouseLeave();
        break;
      }
      case 'feather': {
        this.featherService.mouseLeave();
        break;
      }
      case 'polygon': {
        this.polygonService.mouseLeave();
        break;
      }
      default:
        break;
    }
  }

  setCurrentTool(tool: string): void {
    this.currentTool = tool;
  }

  // tslint:disable-next-line: cyclomatic-complexity
  hotKeysDown(hotkey: string): void {
    switch (this.currentTool) {
      case 'rectangle': {
        if (hotkey === 'Shift') {
          this.rectangleService.shiftkeyDownCall();
        }
        break;
      }
      case 'line': {
        if (hotkey === 'Shift') {
          this.lineService.shiftkeyDownCall();
        }
        if (hotkey === 'Backspace') {
          this.lineService.backspacekeyDownCall();
        }
        if (hotkey === 'Escape') {
          this.lineService.escapekeyDownCall();
        }
        break;
      }
      case 'selection': {
        if (!this.selectionService.hotkeys.get('ArrowLeft') && !this.selectionService.hotkeys.get('ArrowRight') &&
          !this.selectionService.hotkeys.get('ArrowUp') && !this.selectionService.hotkeys.get('ArrowDown')) {
          this.selectionService.hotkeys.set(hotkey, true);
          this.selectionService.hotkeys.set('firstTranslationHold', true);
          this.selectionService.keyboardTransformation(this.canvas);
        } else if (this.selectionService.hotkeys.get('firstTranslationHold')) {
          this.selectionService.hotkeys.set(hotkey, true);
          this.selectionService.hotkeys.set('firstTranslationHold', false);
          const fivehundread = 500;
          setTimeout(() => this.selectionService.keyboardTransformation(this.canvas), fivehundread);
        } else {
          this.selectionService.hotkeys.set(hotkey, true);
          this.selectionService.keyboardTransformation(this.canvas);
        }
        if (hotkey === 'Shift' && !this.selectionService.shiftKey) {
          console.log('update');
          this.selectionService.updateSelectedItemsRotationAxisAndInitPos();
          this.selectionService.shiftKey = true;
        }
        break;
      }
      case 'ellipse': {
        if (hotkey === 'Shift') {
          this.ellipseService.shiftkeyDownCall();
          break;
        }
      }
      case 'text': {
        if (hotkey === 'Backspace') {
          this.textService.deletePreviousCaracter();
        }
        if (hotkey === 'Escape') {
          this.textService.cancelEdition();
        }
        if (hotkey === 'Delete') {
          this.textService.deleteNextCaracter();
        }
        if (hotkey === 'Enter') {
          this.textService.changeLine();
        }
        if (hotkey === 'ArrowLeft') {
          this.textService.moveLeftText();
        }
        if (hotkey === 'ArrowRight') {
          this.textService.moveRightText();
        }
        if (hotkey === 'ArrowDown') {
          this.textService.moveDownText();
        }
        if (hotkey === 'ArrowUp') {
          this.textService.moveUpText();
        }
        break;
      }
      default:
        break;
    }
  }

  hotKeysUp(hotkey: string): void {
    switch (this.currentTool) {
      case 'rectangle': {
        if (hotkey === 'Shift') {
          this.rectangleService.shiftkeyUpCall();
        }
        break;
      }
      case 'line': {
        if (hotkey === 'Shift') {
          this.lineService.shiftkeyUpCall();
        }
        break;
      }
      case 'selection': {
        this.selectionService.hotkeys.set(hotkey, false);
        if (hotkey === 'Shift') {
          this.rotationService.shiftkey = false;
          this.rotationService.updateSelectedItemsInitPosBeforeRotation();
        }
        break;
      }
      case 'ellipse': {
        if (hotkey === 'Shift') {
          this.ellipseService.shiftkeyUpCall();
        }
        break;
      }
      default:
        break;
    }
  }

  selectAllItems(): void {
    if (this.currentTool === 'selection') {
      this.selectionService.selectAllItems(this.canvas);
    }
  }

  rotateSelection(degree: number, centerOfItems: boolean): void {
    if (this.currentTool === 'selection') {
      if (this.selectionService.selectionParameters.firstRotation) {
        this.selectionService.selectionParameters.firstRotation = false;
        this.rotationService.updateSelectedItemsInitPosBeforeRotation();
      }
      this.rotationService.rotateSelection(degree, centerOfItems, this.canvas);
    }
  }
  // pour la clarete du code on a decider de garder tout le code dans le meme ficheir pour ce service
// tslint:disable-next-line: max-file-line-count
}

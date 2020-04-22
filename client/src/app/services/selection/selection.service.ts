import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SelectionParameters } from 'src/app/classes/selection-parameters';
import { SELECTION } from '../enum';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  private renderer: Renderer2;
  selectionParameters: SelectionParameters;
  hotkeys: Map<string, boolean>;
  shiftKey: boolean;

  constructor(private renderFactory: RendererFactory2) {
    this.renderer = this.renderFactory.createRenderer(null, null);
    this.selectionParameters = new SelectionParameters();
    this.selectionParameters.selectedItems = new Map();
    this.selectionParameters.dragDrop = false;
    this.selectionParameters.tempSelectedItems = new Map();
    this.selectionParameters.selectedItemsBoxRotationAxis = new Map();
    this.selectionParameters.selectedItemsRotationAxis = new Map();
    this.selectionParameters.selectedItemsInitPosBeforeRotation = new Map();
    this.hotkeys = new Map();
    this.initialiseHotkeys();
    this.shiftKey = false;
    this.selectionParameters.firstRotation = false;
  }

  initialiseHotkeys(): void {
    this.hotkeys.set(SELECTION.ARROWRIGHT, false)
                .set(SELECTION.ARROWLEFT, false)
                .set(SELECTION.ARROWUP, false)
                .set(SELECTION.ARROWDOWN, false)
                .set(SELECTION.FIRSTTRANSLATIONHOLD, false);
  }

  mouseDown(event: MouseEvent, canvas: SVGElement): void {
    const xClickOffset = 269;
    this.selectionParameters.firstRotation = true;
    this.selectionParameters.object = event.target;
    this.selectionParameters.xClickPosition = event.offsetX - xClickOffset;
    this.selectionParameters.yClickPosition = event.offsetY;

    this.selectionParameters.dragDrop = true;
    this.selectionParameters.xLeftDragDrop = this.selectionParameters.oldMouseMoveXPos = event.offsetX;
    this.selectionParameters.yTopDragDrop = this.selectionParameters.oldMouseMoveYPos = event.offsetY;

    if (event.button === 0) {
      this.selectionParameters.leftClick = true;
      this.selectionParameters.rightClick = false;
      if (this.isClickWithinSelectedItemsBox(event) || (this.selectionParameters.object.parentNode === canvas &&
        !this.selectionParameters.selectedItems.has(this.selectionParameters.object.getAttribute('id')))) {
        this.selectionParameters.mouseMoveAction = 'translate';
      } else {
        this.selectionParameters.mouseMoveAction = 'selection';
      }
    } else if (event.button === 2) {
      this.selectionParameters.leftClick = false;
      this.selectionParameters.rightClick = true;
      this.selectionParameters.mouseMoveAction = 'selection';
    } else {
      this.selectionParameters.leftClick = false;
      this.selectionParameters.rightClick = false;
    }

  }

  mouseMove(event: MouseEvent, canvas: SVGElement): void {
    if (this.selectionParameters.dragDrop) {
      switch (this.selectionParameters.mouseMoveAction) {
        case 'translate':
          if (this.selectionParameters.object === canvas ||
            this.selectionParameters.selectedItems.has(this.selectionParameters.object.getAttribute('id'))) {
            // remove existing selected items rectangle
            if (this.selectionParameters.selectedItemsRect) {
              this.renderer.removeChild(canvas, this.selectionParameters.selectedItemsRect);
            }
            this.deplacement(event.offsetX - this.selectionParameters.oldMouseMoveXPos,
              event.offsetY - this.selectionParameters.oldMouseMoveYPos);
            this.updateSelectedItemsBox();
            this.drawSelectedItemsRect(canvas);
            this.calculateRotationAxis(this.selectionParameters.topSelectedItemsBox, this.selectionParameters.bottomSelectedItemsBox,
              this.selectionParameters.leftSelectedItemsBox, this.selectionParameters.rightSelectedItemsBox,
              this.selectionParameters.selectedItemsBoxRotationAxis);
          } else {
            // remove existing selected items rectangle
            if (this.selectionParameters.selectedItemsRect) {
              this.renderer.removeChild(canvas, this.selectionParameters.selectedItemsRect);
            }
            this.selectionParameters.selectedItems.clear();
            this.selectionParameters.selectedItems.set(this.selectionParameters.object.getAttribute('id'), this.selectionParameters.object);
            this.deplacement(event.offsetX - this.selectionParameters.oldMouseMoveXPos,
              event.offsetY - this.selectionParameters.oldMouseMoveYPos);
            this.updateSelectedItemsBox();
            this.drawSelectedItemsRect(canvas);
            this.calculateRotationAxis(this.selectionParameters.topSelectedItemsBox, this.selectionParameters.bottomSelectedItemsBox,
              this.selectionParameters.leftSelectedItemsBox, this.selectionParameters.rightSelectedItemsBox,
              this.selectionParameters.selectedItemsBoxRotationAxis);
          }
          this.selectionParameters.oldMouseMoveXPos = event.offsetX;
          this.selectionParameters.oldMouseMoveYPos = event.offsetY;
          break;
        case 'selection':
          this.rectSelectionDragDrop(canvas, event);
          break;
      }
    }
  }

  mouseUp(event: MouseEvent, canvas: SVGElement): void {
    this.selectionParameters.dragDrop = false;
    this.selectionParameters.object = event.target;

    // remove existing selection rectangle
    if (this.selectionParameters.selectionRect) {
      this.renderer.removeChild(canvas, this.selectionParameters.selectionRect);
    }

    // click selection
    const posXClick = 269;
    if (Math.abs(event.offsetX - this.selectionParameters.xClickPosition - posXClick) < 2 &&
      Math.abs(event.offsetY - this.selectionParameters.yClickPosition) < 2) {

      if (this.selectionParameters.object.parentNode.getAttribute('id') === 'selectedItemsRect') {
        return;
      }

      if (this.selectionParameters.object.parentNode === canvas || this.selectionParameters.object.parentNode.nodeName === 'g') {
        // remove existing selected items rectangle
        if (this.selectionParameters.selectedItemsRect) {
          this.renderer.removeChild(canvas, this.selectionParameters.selectedItemsRect);
        }
        if (this.selectionParameters.object.parentNode.nodeName === 'g') {
          this.selectionParameters.object = this.selectionParameters.object.parentNode;
        }
        const id = this.selectionParameters.object.getAttribute('id');

        // inversion de l'etat de selection (right click)
        if (this.selectionParameters.rightClick) {
          if (this.selectionParameters.selectedItems.has(id)) {
            this.selectionParameters.selectedItems.delete(id);
          } else {
            this.selectionParameters.selectedItems.set(id, this.selectionParameters.object);
          }
          // selection (left click)
        } else if (this.selectionParameters.leftClick) {
          this.selectionParameters.selectedItems.clear();
          this.selectionParameters.selectedItems.set(id, this.selectionParameters.object);
        }

        this.updateSelectedItemsBox();
        this.drawSelectedItemsRect(canvas);
        this.calculateRotationAxis(this.selectionParameters.topSelectedItemsBox, this.selectionParameters.bottomSelectedItemsBox,
          this.selectionParameters.leftSelectedItemsBox, this.selectionParameters.rightSelectedItemsBox,
          this.selectionParameters.selectedItemsBoxRotationAxis);
      } else if (!this.selectionParameters.rightClick) {
        // remove existing selected items rectangle
        if (this.selectionParameters.selectedItemsRect) {
          this.renderer.removeChild(canvas, this.selectionParameters.selectedItemsRect);
        }
        this.selectionParameters.selectedItems.clear();
      }
    }
  }

  deplacement(xTranslation: number, yTranslation: number): void {
    let oldTransformation = new Map<string, string>();
    let transformation = '';
    this.selectionParameters.selectedItems.forEach((value: SVGElement) => {
      oldTransformation = this.findMatrixValues(value);
      transformation = 'translate(' + (Number(oldTransformation.get('xTranslation')) + xTranslation).toString() + ',' +
      (Number(oldTransformation.get('yTranslation')) + yTranslation).toString() + ') ' + 'rotate(' +
      oldTransformation.get('dRotation') + ',' + oldTransformation.get('xRotation') + ',' + oldTransformation.get('yRotation') + ')';
      console.log(transformation);
      this.renderer.setAttribute(value, 'transform', transformation);
    });
  }

  findMatrixValues(element: SVGElement): Map<string, string> {
    let state = 'xTranslation';
    const transform = element.getAttribute('transform');
    const oldTransformation = new Map<string, string>();
    oldTransformation.set('xTranslation', '')
                      .set('yTranslation', '')
                      .set('dRotation', '')
                      .set('xRotation', '')
                      .set('yRotation', '');
    if (transform) {
      for (let i = 10; i < transform.length; i++) {
        switch (state) {
          case 'xTranslation':
            if (transform.charAt(i) === ',') {
              state = 'yTranslation';
            } else {
              oldTransformation.set('xTranslation', oldTransformation.get('xTranslation') + transform.charAt(i));
            }
            break;
          case 'yTranslation':
            if (transform.charAt(i) === ')') {
              state = 'gap';
            } else {
              oldTransformation.set('yTranslation', oldTransformation.get('yTranslation') + transform.charAt(i));
            }
            break;
          case 'gap':
            if (transform.charAt(i) === '(') {
              state = 'dRotation';
            }
            break;
          case 'dRotation':
            if (transform.charAt(i) === ',') {
              state = 'xRotation';
            } else {
              oldTransformation.set('dRotation', oldTransformation.get('dRotation') + transform.charAt(i));
            }
            break;
          case 'xRotation':
            if (transform.charAt(i) === ',') {
              state = 'yRotation';
            } else {
              oldTransformation.set('xRotation', oldTransformation.get('xRotation') + transform.charAt(i));
            }
            break;
          case 'yRotation':
            if (transform.charAt(i) !== ')') {
              oldTransformation.set('yRotation', oldTransformation.get('yRotation') + transform.charAt(i));
            }
            break;
        }
      }
    }
    return oldTransformation;
  }

  isClickWithinSelectedItemsBox(event: MouseEvent): boolean {
    if (event.offsetX > this.selectionParameters.leftSelectedItemsBox && event.offsetX < this.selectionParameters.rightSelectedItemsBox
      && event.offsetY > this.selectionParameters.topSelectedItemsBox && event.offsetY < this.selectionParameters.bottomSelectedItemsBox) {
      return true;
    } else {
      return false;
    }
  }

  calculateRectangleDimensions(event: MouseEvent): void {
    const x = Math.abs(event.offsetX - this.selectionParameters.xLeftDragDrop);
    const y = Math.abs(event.offsetY - this.selectionParameters.yTopDragDrop);

    if (this.selectionParameters.xLeftDragDrop <= event.offsetX) {
      this.selectionParameters.selectionRectWidth = this.selectionParameters.xLeftDragDrop;
    } else {
      this.selectionParameters.selectionRectWidth = this.selectionParameters.xLeftDragDrop - x;
    }

    if (this.selectionParameters.yTopDragDrop <= event.offsetY) {
      this.selectionParameters.selectionRectHeight = this.selectionParameters.yTopDragDrop;
    } else {
      this.selectionParameters.selectionRectHeight = this.selectionParameters.yTopDragDrop - y;
    }

    this.renderer.setAttribute(this.selectionParameters.selectionRect, SELECTION.X,
      this.selectionParameters.selectionRectWidth.toString());
    this.renderer.setAttribute(this.selectionParameters.selectionRect, SELECTION.Y,
      this.selectionParameters.selectionRectHeight.toString());
    this.renderer.setAttribute(this.selectionParameters.selectionRect, SELECTION.HEIGHT, y.toString());
    this.renderer.setAttribute(this.selectionParameters.selectionRect, SELECTION.WIDTH, x.toString());
  }

  rectSelectionDragDrop(canvas: SVGElement, event: MouseEvent): void {
    // remove existing selection rectangle
    if (this.selectionParameters.selectionRect) {
      this.renderer.removeChild(canvas, this.selectionParameters.selectionRect);
    }

    this.drawSelectionRectangle(canvas, event);

    // remove existing selected items rectangle
    if (this.selectionParameters.selectedItemsRect) {
      this.renderer.removeChild(canvas, this.selectionParameters.selectedItemsRect);
    }
    // inversion de l'etat de selection (right click)
    if (this.selectionParameters.rightClick) {
      this.invertSelectDragDrop(canvas);
    // selection (left click)
    } else if (this.selectionParameters.leftClick) {
      this.selectDragDrop(canvas);
    }
    this.drawSelectedItemsRect(canvas);
    this.calculateRotationAxis(this.selectionParameters.topSelectedItemsBox, this.selectionParameters.bottomSelectedItemsBox,
      this.selectionParameters.leftSelectedItemsBox, this.selectionParameters.rightSelectedItemsBox,
      this.selectionParameters.selectedItemsBoxRotationAxis);
  }

  selectDragDrop(canvas: SVGElement): void {
    this.selectionParameters.selectedItems.clear();
    const drawingElements = canvas.children;
    const selectionBoundingBox = this.selectionParameters.selectionRect.getBoundingClientRect();
    for (let i = 0; i < drawingElements.length; i++) {
      this.selectionParameters.object = drawingElements.item(i);
      if (this.returnIfObject()) {
          const elementBoundingBox = this.selectionParameters.object.getBoundingClientRect();
          if (elementBoundingBox.right >= selectionBoundingBox.left && selectionBoundingBox.right >= elementBoundingBox.left
            && elementBoundingBox.bottom >= selectionBoundingBox.top && selectionBoundingBox.bottom >= elementBoundingBox.top) {
            this.selectionParameters.selectedItems.set(this.selectionParameters.object.getAttribute('id'), this.selectionParameters.object);
            this.selectionParameters.selectedItemsRectId = this.selectionParameters.object.getAttribute('id');
          }
        }
    }
    this.updateSelectedItemsBox();
  }

  invertSelectDragDrop(canvas: SVGElement): void {
    this.selectionParameters.tempSelectedItems = new Map(this.selectionParameters.selectedItems);
    const drawingElements = canvas.children;
    const selectionBoundingBox = this.selectionParameters.selectionRect.getBoundingClientRect();
    for (let i = 0; i < drawingElements.length; i++) {
      this.selectionParameters.object = drawingElements.item(i);
      if (this.returnIfObject()) {
        const elementBoundingBox = this.selectionParameters.object.getBoundingClientRect();
        if (elementBoundingBox.right >= selectionBoundingBox.left && selectionBoundingBox.right >= elementBoundingBox.left
          && elementBoundingBox.bottom >= selectionBoundingBox.top && selectionBoundingBox.bottom >= elementBoundingBox.top) {
            if (this.selectionParameters.selectedItems.has(this.selectionParameters.object.getAttribute('id'))) {
              this.selectionParameters.tempSelectedItems.delete(this.selectionParameters.object.getAttribute('id'));
            } else {
              this.selectionParameters.tempSelectedItems.set(this.selectionParameters.object.getAttribute('id'),
              this.selectionParameters.object);
            }
        }
      }
    }
    this.updateSelectedItemsBox();
  }

  updateDimensions(items: Map<string, SVGElement>): void { // Thom
    const removeUpdateDimension = 269;
    items.forEach((value: SVGElement) => {
      const elementBoundingBox = value.getBoundingClientRect();
      const halfStrokeWidth = Number(value.getAttribute('stroke-width')) / 2;

      if (elementBoundingBox.left - halfStrokeWidth - removeUpdateDimension < this.selectionParameters.leftSelectedItemsBox) {
        this.selectionParameters.leftSelectedItemsBox = elementBoundingBox.left - halfStrokeWidth - removeUpdateDimension;
      }
      if (elementBoundingBox.right + halfStrokeWidth - removeUpdateDimension > this.selectionParameters.rightSelectedItemsBox) {
        this.selectionParameters.rightSelectedItemsBox = elementBoundingBox.right + halfStrokeWidth - removeUpdateDimension;
      }
      if (elementBoundingBox.bottom + halfStrokeWidth > this.selectionParameters.bottomSelectedItemsBox) {
        this.selectionParameters.bottomSelectedItemsBox = elementBoundingBox.bottom + halfStrokeWidth;
      }
      if (elementBoundingBox.top - halfStrokeWidth < this.selectionParameters.topSelectedItemsBox) {
        this.selectionParameters.topSelectedItemsBox = elementBoundingBox.top - halfStrokeWidth;
      }
    });
  }

  updateSelectedItemsBox(): void { // Thom
    const itemBox = 2000;
    this.selectionParameters.leftSelectedItemsBox = itemBox;
    this.selectionParameters.rightSelectedItemsBox = 0;
    this.selectionParameters.topSelectedItemsBox = itemBox;
    this.selectionParameters.bottomSelectedItemsBox = 0;

    if (this.selectionParameters.dragDrop && this.selectionParameters.rightClick) {
      if (this.selectionParameters.tempSelectedItems.size === 0 && this.selectionParameters.selectedItems.size === 0) {
        this.selectionParameters.areItemsSelected = false;
      } else {
        this.selectionParameters.areItemsSelected = true;
        this.updateDimensions(this.selectionParameters.tempSelectedItems);
      }
    } else {
      if (this.selectionParameters.selectedItems.size === 0) {
        this.selectionParameters.areItemsSelected = false;
      } else {
        this.selectionParameters.areItemsSelected = true;
        this.updateDimensions(this.selectionParameters.selectedItems);
      }
    }
  }

  drawSelectedItemsRect(canvas: SVGElement): void { // Thom done
    if (this.selectionParameters.areItemsSelected) {
      const selectItems = 8;
      this.selectionParameters.selectedItemsRect = this.renderer.createElement('g', SELECTION.LINK);
      this.renderer.setAttribute(this.selectionParameters.selectedItemsRect, 'id', 'selectedItemsRect');

      this.selectionParameters.selectedItemsMainRect = this.renderer.createElement(SELECTION.RECT, SELECTION.LINK);
      this.selectionParameters.controlPointBottom = this.renderer.createElement(SELECTION.RECT, SELECTION.LINK);
      this.selectionParameters.controlPointTop = this.renderer.createElement(SELECTION.RECT, SELECTION.LINK);
      this.selectionParameters.controlPointLeft = this.renderer.createElement(SELECTION.RECT, SELECTION.LINK);
      this.selectionParameters.controlPointRight = this.renderer.createElement(SELECTION.RECT, SELECTION.LINK);

      const height = this.selectionParameters.bottomSelectedItemsBox - this.selectionParameters.topSelectedItemsBox;
      const width = this.selectionParameters.rightSelectedItemsBox - this.selectionParameters.leftSelectedItemsBox;

      const controlPointsCoordinates = this.setControlPointsCoordinates(width, height);

      this.setAttributesSelectedItemsRect(this.selectionParameters.selectedItemsMainRect, 'selectedItemsMainRect',
      this.selectionParameters.leftSelectedItemsBox, this.selectionParameters.topSelectedItemsBox, height, width, 'none');

      this.setAttributesSelectedItemsRect(this.selectionParameters.controlPointLeft, 'controlPointLeft',
      controlPointsCoordinates.get('xLeft') as number, controlPointsCoordinates.get('yLeft') as number, selectItems, selectItems, 'white');

      this.setAttributesSelectedItemsRect(this.selectionParameters.controlPointRight, 'controlPointRight',
      controlPointsCoordinates.get('xRight') as number, controlPointsCoordinates.get('yRight') as number,
      selectItems, selectItems, 'white');

      this.setAttributesSelectedItemsRect(this.selectionParameters.controlPointTop, 'controlPointTop',
      controlPointsCoordinates.get('xTop') as number, controlPointsCoordinates.get('yTop') as number, selectItems, selectItems, 'white');

      this.setAttributesSelectedItemsRect(this.selectionParameters.controlPointBottom, 'controlPointBottom',
      controlPointsCoordinates.get('xBottom') as number, controlPointsCoordinates.get('yBottom') as number,
      selectItems, selectItems, 'white');

      this.renderer.appendChild(this.selectionParameters.selectedItemsRect, this.selectionParameters.selectedItemsMainRect);
      this.renderer.appendChild(this.selectionParameters.selectedItemsRect, this.selectionParameters.controlPointLeft);
      this.renderer.appendChild(this.selectionParameters.selectedItemsRect, this.selectionParameters.controlPointRight);
      this.renderer.appendChild(this.selectionParameters.selectedItemsRect, this.selectionParameters.controlPointTop);
      this.renderer.appendChild(this.selectionParameters.selectedItemsRect, this.selectionParameters.controlPointBottom);

      this.renderer.appendChild(canvas, this.selectionParameters.selectedItemsRect);
    }
  }

  setControlPointsCoordinates(mainRectWidth: number, mainRectHeight: number): Map<string, number> { // Daph
    const fourMap = 4;
    const map = new Map<string, number>();
    map.set('xLeft', this.selectionParameters.leftSelectedItemsBox - fourMap)
       .set('yLeft', this.selectionParameters.topSelectedItemsBox + (mainRectHeight / 2) - fourMap)
       .set('xRight', this.selectionParameters.leftSelectedItemsBox + mainRectWidth - fourMap)
       .set('yRight', this.selectionParameters.topSelectedItemsBox + (mainRectHeight / 2) - fourMap)
       .set('xTop', this.selectionParameters.leftSelectedItemsBox + (mainRectWidth / 2) - fourMap)
       .set('yTop', this.selectionParameters.topSelectedItemsBox - fourMap)
       .set('xBottom', this.selectionParameters.leftSelectedItemsBox + (mainRectWidth / 2) - fourMap)
       .set('yBottom', this.selectionParameters.topSelectedItemsBox + mainRectHeight - fourMap);
    return map;
  }

  setAttributesSelectedItemsRect(item: SVGElement, id: string, x: number, y: number, height: number, width: number, fill: string): void {
    this.renderer.setAttribute(item, SELECTION.X, x.toString());
    this.renderer.setAttribute(item, SELECTION.Y, y.toString());
    this.renderer.setAttribute(item, SELECTION.HEIGHT, height.toString());
    this.renderer.setAttribute(item, SELECTION.WIDTH, width.toString());
    this.renderer.setAttribute(item, SELECTION.STROKE_WIDTH, '1');
    this.renderer.setAttribute(item, SELECTION.STROKE, 'red');
    this.renderer.setAttribute(item, SELECTION.FILL, fill);
    this.renderer.setAttribute(item, SELECTION.ID, id);
  }

  drawSelectionRectangle(canvas: SVGElement, event: MouseEvent): void { // Daph Done
    this.selectionParameters.selectionRect = this.renderer.createElement(SELECTION.RECT, SELECTION.LINK);
    this.calculateRectangleDimensions(event);

    this.renderer.setAttribute(this.selectionParameters.selectionRect, SELECTION.STROKE_WIDTH, '1');
    this.renderer.setAttribute(this.selectionParameters.selectionRect, SELECTION.STROKE, 'black');
    this.renderer.setAttribute(this.selectionParameters.selectionRect, SELECTION.FILL, 'none');
    this.renderer.setAttribute(this.selectionParameters.selectionRect, 'stroke-dasharray', '4, 1');
    this.renderer.setAttribute(this.selectionParameters.selectionRect, 'id', 'selectionRect');

    this.renderer.appendChild(canvas, this.selectionParameters.selectionRect);
  }

  keyboardTransformation(canvas: SVGElement): void { // Thom done
    // remove existing selected items rectangle
    const positiveDeplacement = 3;
    const negativeDeplacement = -3;
    const timeOut = 100;
    if (this.selectionParameters.selectedItemsRect) {
      this.renderer.removeChild(canvas, this.selectionParameters.selectedItemsRect);
    }
    if (this.hotkeys.get('ArrowLeft')) {
      setTimeout(() => this.deplacement(negativeDeplacement, 0), timeOut);
    }
    if (this.hotkeys.get('ArrowRight')) {
      setTimeout(() => this.deplacement(positiveDeplacement, 0), timeOut);
    }
    if (this.hotkeys.get('ArrowUp')) {
      setTimeout(() => this.deplacement(0, negativeDeplacement), timeOut);
    }
    if (this.hotkeys.get('ArrowDown')) {
      setTimeout(() => this.deplacement(0, positiveDeplacement), timeOut);
    }
    this.updateSelectedItemsBox();
    this.drawSelectedItemsRect(canvas);
    this.calculateRotationAxis(this.selectionParameters.topSelectedItemsBox, this.selectionParameters.bottomSelectedItemsBox,
      this.selectionParameters.leftSelectedItemsBox, this.selectionParameters.rightSelectedItemsBox,
      this.selectionParameters.selectedItemsBoxRotationAxis);
  }

  selectAllItems(canvas: SVGElement): void { // Daph
    // remove existing selected items rectangle
    if (this.selectionParameters.selectedItemsRect) {
      this.renderer.removeChild(canvas, this.selectionParameters.selectedItemsRect);
    }
    const drawingElements = canvas.children;
    this.selectionParameters.selectedItems.clear();
    for (let i = 0; i < drawingElements.length; i++) {
      this.selectionParameters.object = drawingElements.item(i);
      if (this.returnIfObject()) {
        this.selectionParameters.selectedItems.set(this.selectionParameters.object.getAttribute('id'), this.selectionParameters.object);
        }
    }
    this.updateSelectedItemsBox();
    this.drawSelectedItemsRect(canvas);
    this.calculateRotationAxis(this.selectionParameters.topSelectedItemsBox, this.selectionParameters.bottomSelectedItemsBox,
      this.selectionParameters.leftSelectedItemsBox, this.selectionParameters.rightSelectedItemsBox,
      this.selectionParameters.selectedItemsBoxRotationAxis);
  }

  returnIfObject(): boolean {
    let result: boolean;
    result = this.selectionParameters.object.getAttribute('id') !== 'selectionRect' &&
    this.selectionParameters.object.getAttribute('id') !== 'selectedItemsRect';
    return result;
  }
// Ne vaut pas la peine de separer ce service
// tslint:disable-next-line: max-file-line-count

  updateForClipboard(canvas: SVGElement, del: boolean): void {
    this.renderer.removeChild(canvas, this.selectionParameters.selectedItemsRect);
    if (!del) {
      this.updateSelectedItemsBox();
      this.drawSelectedItemsRect(canvas);
      this.calculateRotationAxis(this.selectionParameters.topSelectedItemsBox, this.selectionParameters.bottomSelectedItemsBox,
        this.selectionParameters.leftSelectedItemsBox, this.selectionParameters.rightSelectedItemsBox,
        this.selectionParameters.selectedItemsBoxRotationAxis);
    }
  }

  calculateRotationAxis(top: number, bottom: number, left: number, right: number, rotationAxis: Map<string, string>): void {
    const x = left + ((right - left) / 2);
    const y = top + ((bottom - top) / 2);
    rotationAxis.set('x', x.toString())
          .set('y', y.toString());
  }

  updateSelectedItemsRotationAxisAndInitPos(): void {
    const offset = 269;
    this.selectionParameters.selectedItemsInitPosBeforeRotation.clear();
    this.selectionParameters.selectedItemsRotationAxis.clear();
    this.selectionParameters.selectedItems.forEach((element) => {
      const boundingBox = element.getBoundingClientRect();
      const x = boundingBox.left + ((boundingBox.right - boundingBox.left) / 2) - offset;
      const y = boundingBox.top + ((boundingBox.bottom - boundingBox.top) / 2);
      this.selectionParameters.selectedItemsRotationAxis.set(element.getAttribute('id') as string, [x.toString(), y.toString()]);
      this.selectionParameters.selectedItemsInitPosBeforeRotation.set(element.getAttribute('id') as string, [x, y, 0, 0, 0]);
    });
  }
  // pour la clarete du code on a garder tout le code dans le meme ficheir
// tslint:disable-next-line: max-file-line-count
}

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class RotationService {

  private renderer: Renderer2;
  isSelectionRotating: boolean;
  shiftkey: boolean;

  constructor(private renderFactory: RendererFactory2, private selectionService: SelectionService) {
    this.renderer = this.renderFactory.createRenderer(null, null);
    this.isSelectionRotating = false;
    this.shiftkey = false;
  }

  rotateSelection(degree: number, centerOfItems: boolean, canvas: SVGElement): void {
    const zero = 0;
    const one = 1;
    let transformation = '';
    // remove existing selected items rectangle
    if (this.selectionService.selectionParameters.selectedItemsRect) {
      this.renderer.removeChild(canvas, this.selectionService.selectionParameters.selectedItemsRect);
    }

    this.selectionService.selectionParameters.selectedItems.forEach((value: SVGElement) => {
      const oldTransformation = this.selectionService.findMatrixValues(value);
      if (centerOfItems) {
        const singleItemRotationAxis = new Map<string, string>();
        singleItemRotationAxis.set('x',
        (this.selectionService.selectionParameters.selectedItemsRotationAxis.get(value.getAttribute('id') as string) as string[])[zero])
                              .set('y',
        (this.selectionService.selectionParameters.selectedItemsRotationAxis.get(value.getAttribute('id') as string) as string[])[one]);
        transformation = this.setTransformation(degree, oldTransformation, singleItemRotationAxis, value);
      } else {
        transformation = this.setTransformation(degree, oldTransformation,
          this.selectionService.selectionParameters.selectedItemsBoxRotationAxis, value);
      }
      this.renderer.setAttribute(value, 'transform', transformation);
    });

    this.selectionService.updateSelectedItemsBox();
    this.selectionService.drawSelectedItemsRect(canvas);
    if (centerOfItems) {
      this.selectionService.calculateRotationAxis(this.selectionService.selectionParameters.topSelectedItemsBox,
        this.selectionService.selectionParameters.bottomSelectedItemsBox,
        this.selectionService.selectionParameters.leftSelectedItemsBox,
        this.selectionService.selectionParameters.rightSelectedItemsBox,
        this.selectionService.selectionParameters.selectedItemsBoxRotationAxis);
    }
  }

  setTransformation(degree: number, oldTransformation: Map<string, string>, rotationAxis: Map<string, string>, item: SVGElement): string {
    const zero = 0;
    const one = 1;
    const two = 2;
    const three = 3;
    const four = 4;
    const halfCircle = 180;
    const initPosX = Number((this.selectionService.selectionParameters.selectedItemsInitPosBeforeRotation.
      get(item.getAttribute('id') as string) as number[])[zero]);
    const initPosY = Number((this.selectionService.selectionParameters.selectedItemsInitPosBeforeRotation.
      get(item.getAttribute('id') as string) as number[])[one]);
    let transformation: string;

    const oldDegree = (this.selectionService.selectionParameters.selectedItemsInitPosBeforeRotation.
      get(item.getAttribute('id') as string) as number[])[four];
    const newDegree = oldDegree + degree;

    (this.selectionService.selectionParameters.selectedItemsInitPosBeforeRotation.
      get(item.getAttribute('id') as string) as number[])[four] = newDegree;

    const xf = (initPosX - Number(rotationAxis.get('x'))) * Math.cos(newDegree / halfCircle * Math.PI) -
      (initPosY - Number(rotationAxis.get('y'))) * Math.sin(newDegree / halfCircle * Math.PI) +
      Number(rotationAxis.get('x'));

    const yf = (initPosY - Number(rotationAxis.get('y'))) * Math.cos(newDegree / halfCircle * Math.PI) +
      (initPosX - Number(rotationAxis.get('x'))) * Math.sin(newDegree / halfCircle * Math.PI) +
      Number(rotationAxis.get('y'));

    const newXTranslation = xf - initPosX;
    const newYTranslation = yf - initPosY;

    const rXTranslation = (this.selectionService.selectionParameters.selectedItemsInitPosBeforeRotation.
      get(item.getAttribute('id') as string) as number[])[two];
    const rYTranslation = (this.selectionService.selectionParameters.selectedItemsInitPosBeforeRotation.
      get(item.getAttribute('id') as string) as number[])[three];

    (this.selectionService.selectionParameters.selectedItemsInitPosBeforeRotation.
        get(item.getAttribute('id') as string) as number[])[two] = newXTranslation;

    (this.selectionService.selectionParameters.selectedItemsInitPosBeforeRotation.
      get(item.getAttribute('id') as string) as number[])[three] = newYTranslation;

    transformation = 'translate(' + (newXTranslation + Number(oldTransformation.get('xTranslation')) - rXTranslation).toString() + ',' +
      (newYTranslation + Number(oldTransformation.get('yTranslation')) - rYTranslation).toString() + ') rotate(' +
      (Number(oldTransformation.get('dRotation')) + newDegree - oldDegree).toString() + ',' +
      (xf - (Number(oldTransformation.get('xTranslation')) - rXTranslation)).toString() + ',' +
      (yf - (Number(oldTransformation.get('yTranslation')) - rYTranslation)).toString() + ')';
    return transformation;
  }

  updateSelectedItemsInitPosBeforeRotation(): void {
    const offset = 269;
    this.selectionService.selectionParameters.selectedItemsInitPosBeforeRotation.clear();
    this.selectionService.selectionParameters.selectedItems.forEach((element) => {
      const boundingBox = element.getBoundingClientRect();
      const x = boundingBox.left + ((boundingBox.right - boundingBox.left) / 2) - offset;
      const y = boundingBox.top + ((boundingBox.bottom - boundingBox.top) / 2);
      this.selectionService.selectionParameters.selectedItemsInitPosBeforeRotation.set(element.getAttribute('id') as string,
      [x, y, 0, 0, 0]);
    });
  }

}

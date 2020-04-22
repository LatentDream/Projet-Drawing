import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ToolPropFeather } from '../../../classes/tool-prop-feather';
import { ColorService } from '../../color/color.service';
import { FEATHER } from '../../enum';

const THREE = 3;
@Injectable({
  providedIn: 'root'
})
export class FeatherService {
  private renderer: Renderer2;
  currentlyDrawing: boolean;
  private parent: HTMLElement;
  strokeWidth: number;
  points: number[][];
  featherAngle: number[];
  private prop: ToolPropFeather;

  constructor(renderFactory: RendererFactory2, private colorService: ColorService) {
    this.renderer = renderFactory.createRenderer(null, null);
    this.prop = new ToolPropFeather();
    this.currentlyDrawing = false;
    this.strokeWidth = 2;
    this.points = [];
  }

  mouseDown(event: MouseEvent, itemCount: number): void {
    this.currentlyDrawing = true;
    this.setParent(event);
    this.prop.element = this.renderer.createElement(FEATHER.ELEMENT, FEATHER.LINK);
    this.featherAngle = [1 * this.strokeWidth, 0];
    this.renderer.appendChild(this.parent, this.prop.element);
    this.points.push([event.offsetX, event.offsetY]);
  }

  nextPoint(offsetPoint: number[]): void {
    const newPoints = [];
    const lastP = this.points[this.points.length - 2];
    console.log(this.points);
    console.log(lastP);
    newPoints[0] = [offsetPoint[0] + this.featherAngle[0], offsetPoint[1] + this.featherAngle[1]];
    newPoints[1] = [offsetPoint[0] - this.featherAngle[0], offsetPoint[1] - this.featherAngle[1]];
    newPoints[2] = [lastP[0] - this.featherAngle[0], lastP[1] - this.featherAngle[1]];
    newPoints[THREE] = [lastP[0] + this.featherAngle[0], lastP[1] + this.featherAngle[1]];
    const path = newPoints[0] + ' ' + newPoints[1] + ' ' + newPoints[2] + ' ' + newPoints[THREE];
    const polygon = this.renderer.createElement(FEATHER.POLYGON, FEATHER.LINK);
    this.renderer.setAttribute(polygon, FEATHER.FILL, this.colorService.primaryColor);
    this.renderer.appendChild(this.parent, polygon);
    this.renderer.setAttribute(polygon, FEATHER.POINTS, path);
}

  mouseMove(event: MouseEvent): void {
    if (this.currentlyDrawing) {
      this.points.push([event.offsetX, event.offsetY]);
      this.nextPoint([event.offsetX, event.offsetY]);
      }
  }

  mouseUp(event: MouseEvent): void {
    if (this.currentlyDrawing) {
      this.currentlyDrawing = false;
      this.points = [];
    }
  }

  mouseLeave(): void {
    if (this.currentlyDrawing) {
      this.currentlyDrawing = false;
      this.points = [];
    }
  }

  setParent(event: MouseEvent): void {
    if (String((event.target as HTMLElement).nodeName) !== 'svg') {
      this.parent = (event.target as HTMLElement).parentNode as HTMLElement;
    } else {
      this.parent = event.target as HTMLElement;
    }
  }

}

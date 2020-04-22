import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ToolPropAero } from 'src/app/classes/tool-prop-aero';
import { ColorService } from '../color/color.service';
import { CIRCLE, SPRAY } from '../enum';

@Injectable({
  providedIn: 'root'
})
export class SprayService {

  strokeWidth: number;
  private currentlyDrawing: boolean;
  private parent: HTMLElement;
  private renderer: Renderer2;
  private prop: ToolPropAero;
  private dot: Node;
  emissionPerSec: number;

  constructor(private rendererFactory: RendererFactory2, private colorService: ColorService) {
    this.currentlyDrawing = false;
    this.prop = new ToolPropAero();
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.emissionPerSec = SPRAY.MAX_EPS;
  }

  mouseDown(event: MouseEvent, itemCount: number): void {
    this.currentlyDrawing = true;

    this.setParent(event);
    // Add the attribute to the prop.element
    this.prop.element = this.renderer.createElement(SPRAY.ELEMENT, SPRAY.LINK);
    this.renderer.appendChild(this.parent, this.prop.element);
    this.renderer.setAttribute(this.prop.element, 'id', itemCount.toString());
    this.renderer.setAttribute(this.prop.element, 'transform', 'translate(0,0) rotate(0,0,0)');

    this.prop.x = event.offsetX;
    this.prop.y = event.offsetY;

    this.setDotParams();
    // Draw first dot
    this.startRendering();
  }

  mouseMove(event: MouseEvent): void {
    if (this.currentlyDrawing) {
      this.prop.x = event.offsetX;
      this.prop.y = event.offsetY;
    }
  }

  mouseUp(): void {
    this.currentlyDrawing = false;
  }

  mouseLeave(): void {
    this.currentlyDrawing = false;
  }

  setParent(event: MouseEvent): void {
    if (String((event.target as HTMLElement).nodeName) !== 'svg') {
      this.parent = (event.target as HTMLElement).parentNode as HTMLElement;
    } else {
      this.parent = event.target as HTMLElement;
    }
  }

  setDotParams(): void {
    this.dot = this.renderer.createElement(CIRCLE.ELEMENT, CIRCLE.LINK);
    this.renderer.setAttribute(this.prop.element, CIRCLE.FILL, this.colorService.primaryColor);
  }

  startRendering = () => {
    const timeOut = 1000;
    if (this.currentlyDrawing) {
      for (let i = 0; i < this.strokeWidth; i++) {
        this.dot = this.dot.cloneNode();
        const random = this.random();
        this.renderer.setAttribute(this.dot, CIRCLE.CX, (random[SPRAY.X] + this.prop.x).toString());
        this.renderer.setAttribute(this.dot, CIRCLE.CY, (random[SPRAY.Y] + this.prop.y).toString());
        this.renderer.setAttribute(this.dot, CIRCLE.R, (
          SPRAY.BASE_R + SPRAY.BASE_R * (this.strokeWidth - random[SPRAY.HYP]) / this.strokeWidth
          ).toString());
        this.renderer.appendChild(this.prop.element, this.dot);

      }
      setTimeout(this.startRendering,  timeOut / (this.emissionPerSec) - 1);
    } else {
      return;
    }
  }

  random(): number[] {
    const hyp = Math.random() * this.strokeWidth;
    const angle = Math.random() * 2 *  Math.PI;
    return [hyp * Math.cos(angle), hyp * Math.sin(angle), hyp];
  }

}

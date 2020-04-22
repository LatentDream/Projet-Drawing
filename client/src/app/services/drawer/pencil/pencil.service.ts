import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ToolPropPath } from '../../../classes/tool-prop-path';
import { ColorService } from '../../color/color.service';
import { PATH } from '../../enum';

@Injectable({
  providedIn: 'root'
})
export class PencilService {
  strokeWidth: number;
  private renderer: Renderer2;
  private currentlyDrawing: boolean;
  private parent: HTMLElement;

  // all private attributes of the SVG path
  private prop: ToolPropPath;

  constructor(renderFactory: RendererFactory2, private colorService: ColorService) {
    this.renderer = renderFactory.createRenderer(null, null);
    this.prop = new ToolPropPath();
    this.currentlyDrawing = false;
  }

  mouseDown(event: MouseEvent, itemCount: number): void {
    this.currentlyDrawing = true;

    this.setParent(event);

    // Set the initial coords for when the mouse mouve
    this.prop.x1 = this.prop.lastXPosition = event.offsetX;
    this.prop.y1 = this.prop.lastYPosition = event.offsetY;
    this.prop.position = 'M' + this.prop.x1.toString() + ',' + this.prop.y1.toString();

    // Add the attribute to the prop.element
    this.prop.element = this.renderer.createElement(PATH.ELEMENT, PATH.LINK);
    this.renderer.setAttribute(this.prop.element, PATH.D, this.prop.position );
    this.renderer.setAttribute(this.prop.element, PATH.FILL, 'none');
    this.renderer.setAttribute(this.prop.element, PATH.STROKE, this.colorService.primaryColor);
    this.renderer.setAttribute(this.prop.element, PATH.STROKE_WIDTH, this.strokeWidth.toString());
    this.renderer.setAttribute(this.prop.element, 'id', itemCount.toString());
    this.renderer.setAttribute(this.prop.element, 'transform', 'translate(0,0) rotate(0,0,0)');
    this.renderer.appendChild(this.parent, this.prop.element);
    this.renderer.setAttribute(this.prop.element, PATH.STROKE_LINECAP, 'round');

    // Draw first dot
    this.prop.position += ', ' + event.offsetX.toString() + ' ' + event.offsetY.toString();
    this.renderer.setAttribute(this.prop.element, PATH.D, this.prop.position);
  }

  mouseMove(event: MouseEvent): void {
    if (this.currentlyDrawing) {
      if (Math.abs(event.offsetX - this.prop.lastXPosition) > 2 || Math.abs(event.offsetY - this.prop.lastYPosition) > 2) {
        this.prop.position += ', ' + event.offsetX.toString() + ' ' + event.offsetY.toString();
        this.renderer.setAttribute(this.prop.element, PATH.D, this.prop.position);
        this.prop.lastXPosition = event.offsetX;
        this.prop.lastYPosition = event.offsetY;
      }
    }
  }

  mouseUp(event: MouseEvent): void {
    if (this.currentlyDrawing) {
      this.currentlyDrawing = false;
    }
  }

  mouseLeave(): void {
    if (this.currentlyDrawing) {
      this.currentlyDrawing = false;
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

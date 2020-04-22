import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ToolPropPath } from '../../../classes/tool-prop-path';
import { ColorService } from '../../color/color.service';
import { PATH } from '../../enum';

@Injectable({
  providedIn: 'root'
})
export class BrushService {

  strokeWidth: number;
  private renderer: Renderer2;
  private rendering: boolean;
  private parent: SVGElement;
  private prop: ToolPropPath;
  currentFilter: HTMLElement;

  constructor(private renderFactory: RendererFactory2, private colorService: ColorService) {
    this.renderer = this.renderFactory.createRenderer(null, null);
    this.prop = new ToolPropPath();
    this.rendering = false;

  }

  mouseDown(event: MouseEvent, itemCount: number): void {
    this.rendering = true;

    this.createParent(event.target as EventTarget);

    this.prop.x1 = this.prop.lastXPosition = event.offsetX;
    this.prop.y1 = this.prop.lastYPosition = event.offsetY;
    this.prop.position = 'M' + this.prop.x1.toString() + ',' + this.prop.y1.toString();

    // Add the attribute to the path
    this.prop.element = this.renderer.createElement(PATH.ELEMENT, PATH.LINK);
    this.renderer.setAttribute(this.prop.element, PATH.D, this.prop.position );
    this.setPathAttributes(this.prop.element, this.renderer, this.colorService.primaryColor,
      this.strokeWidth.toString(), this.currentFilter, itemCount);
    this.renderer.appendChild(this.parent, this.prop.element);

    // Draw first dot
    this.prop.position += ', ' + (this.prop.x1 + 1).toString() + ' ' + (this.prop.y1 + 1).toString();
    this.renderer.setAttribute(this.prop.element, PATH.D, this.prop.position);

  }

  mouseMove(event: MouseEvent): void {
    if (this.rendering) {
      if (Math.abs(event.offsetX - this.prop.lastXPosition) > 2 || Math.abs(event.offsetY - this.prop.lastYPosition) > 2) {
        this.prop.position += ', ' + event.offsetX.toString() + ' ' + event.offsetY.toString();
        this.renderer.setAttribute(this.prop.element, PATH.D, this.prop.position);
        this.prop.lastXPosition = event.offsetX;
        this.prop.lastYPosition = event.offsetY;
      }
    }
  }

  mouseUp(event: MouseEvent): void {
    if (this.rendering) {
      this.rendering = false;
    }
  }

  mouseLeave(): void {
    if (this.rendering) {
      this.rendering = false;
    }
  }

  setPathAttributes(path: HTMLElement, renderer: Renderer2, color: string, strokeWidth: string,
                    currentFilter: HTMLElement, itemCount: number): void {
    renderer.setAttribute(path, PATH.FILL, 'none');
    renderer.setAttribute(path, PATH.STROKE, color);
    renderer.setAttribute(path, PATH.STROKE_WIDTH, strokeWidth);
    renderer.setAttribute(path, PATH.STROKE_LINECAP, 'round');
    renderer.setAttribute(path, 'id', itemCount.toString());
    renderer.setAttribute(path, 'transform', 'translate(0,0) rotate(0,0,0)');
    renderer.setAttribute(path, PATH.FILTER, 'url(#' + currentFilter.getAttribute('id') + ')');
  }
  // event target type must be any because event target could be of any type
  createParent(eventTarget: EventTarget): void {
    if ((eventTarget as SVGElement).nodeName !== 'svg') {
      this.parent = (eventTarget as SVGElement).parentNode as SVGElement;
    } else {
      this.parent = (eventTarget as SVGElement);
    }
  }
}

import { Injectable,  Renderer2, RendererFactory2 } from '@angular/core';
import { ToolPropRect } from '../../../classes/tool-prop-rect';
import { ColorService } from '../../color/color.service';
import { ShapeService } from '../shape.service';
import { RECT } from './../../enum';

@Injectable({
  providedIn: 'root'
})
export class RectangleService {

  private renderer: Renderer2;
  private rendering: boolean;
  private parent: HTMLElement;
  private lastMouseEvent: MouseEvent;
  // all pivate attibutes of the svg path
  private prop: ToolPropRect;

  constructor(renderFactory: RendererFactory2, private shapeService: ShapeService, private colorService: ColorService) {
    this.renderer = renderFactory.createRenderer(null, null);
    this.rendering = false;
    this.prop = new ToolPropRect();
    this.shapeService.shapeType = 'contourFilled';
    const width = 10;
    this.shapeService.strokeWidth = width;
    const nbSide = 3;
    this.shapeService.nbSides = nbSide;
  }

  mouseDown(event: MouseEvent, itemCount: number): void {
    this.rendering = true;

    this.setParent(event);

    this.prop.xTop = event.offsetX;
    this.prop.yTop = event.offsetY;

    this.prop.element = this.renderer.createElement(RECT.ELEMENT, RECT.LINK);

    this.renderer.setAttribute(this.prop.element, RECT.X, this.prop.xTop.toString());
    this.renderer.setAttribute(this.prop.element, RECT.Y, this.prop.yTop.toString());

    this.prop.height = 0;
    this.prop.width = 0;

    this.renderer.setAttribute(this.prop.element, RECT.HEIGHT, this.prop.height.toString());
    this.renderer.setAttribute(this.prop.element, RECT.WIDTH, this.prop.width.toString());
    this.renderer.setAttribute(this.prop.element, 'id', itemCount.toString());
    this.renderer.setAttribute(this.prop.element, 'transform', 'translate(0,0) rotate(0,0,0)');

    switch (this.shapeService.shapeType) {
      case 'contour': { // contour only
        this.renderer.setAttribute(this.prop.element, RECT.STROKE_WIDTH, this.shapeService.strokeWidth.toString());
        this.renderer.setAttribute(this.prop.element, RECT.STROKE, this.colorService.secondaryColor);
        this.renderer.setAttribute(this.prop.element, RECT.FILL, 'none');
        break;
      }
      case 'filled': { // fill only
        this.renderer.setAttribute(this.prop.element, RECT.STROKE_WIDTH, '0');
        this.renderer.setAttribute(this.prop.element, RECT.FILL, this.colorService.primaryColor);
        break;
      }
      case 'contourFilled': { // contour and fill
        this.renderer.setAttribute(this.prop.element, RECT.STROKE, this.colorService.secondaryColor);
        this.renderer.setAttribute(this.prop.element, RECT.STROKE_WIDTH, this.shapeService.strokeWidth.toString());
        this.renderer.setAttribute(this.prop.element, RECT.FILL, this.colorService.primaryColor);
        break;
      }
    }

    this.renderer.appendChild(this.parent, this.prop.element);
  }

  setParent(event: MouseEvent): void {
    if (String((event.target as HTMLElement).nodeName) !== 'svg') {
      this.parent = (event.target as HTMLElement).parentNode as HTMLElement;
    } else {
      this.parent = event.target as HTMLElement;
    }
  }

  mouseMove(event: MouseEvent): void {
    // we need to keep track of the last mouse event in case the user presses shift to render a square but does not move the mouse
    this.lastMouseEvent = event;

    if (this.rendering) {
      // render a rectangle
      if (!event.shiftKey) {
        const x = Math.abs(event.offsetX - this.prop.xTop);
        const y = Math.abs(event.offsetY - this.prop.yTop);

        if (this.prop.xTop <= event.offsetX) {
          this.prop.width = this.prop.xTop;
        } else {
          this.prop.width = this.prop.xTop - x;
        }

        if (this.prop.yTop <= event.offsetY) {
          this.prop.height = this.prop.yTop;
        } else {
          this.prop.height = this.prop.yTop - y;
        }

        this.renderer.setAttribute(this.prop.element, RECT.X, this.prop.width.toString());
        this.renderer.setAttribute(this.prop.element, RECT.Y, this.prop.height.toString());
        this.renderer.setAttribute(this.prop.element, RECT.WIDTH, x.toString());
        this.renderer.setAttribute(this.prop.element, RECT.HEIGHT, y.toString());
      } else {
        this.renderSquare(event);

      }
    }
  }

  mouseUp(event: MouseEvent): void {
    this.rendering = false;
  }

  mouseLeave(): void {
    this.rendering = false;
  }

  renderSquare(event: MouseEvent): void {

    const x = Math.abs(event.offsetX - this.prop.xTop);
    const y = Math.abs(event.offsetY - this.prop.yTop);
    // largest side
    let side = 0;

    // indentify largest segment
    if (x < y) {
      side = x;
    } else {
      side = y;
    }

    if (side === x) {
      if (this.prop.xTop <= event.offsetX) {
        this.prop.width = this.prop.xTop;
      } else {
        this.prop.width = this.prop.xTop - side;
      }
      if (this.prop.yTop <= event.offsetY) {
        this.prop.height = this.prop.yTop;
      } else {
        this.prop.height = this.prop.yTop - side;
      }

    } else {
      if (this.prop.xTop <= event.offsetX) {
        this.prop.width = this.prop.xTop;
      } else {
        this.prop.width = this.prop.xTop - side;
      }
      if (this.prop.yTop <= event.offsetY) {
        this.prop.height = this.prop.yTop;
      } else {
        this.prop.height = this.prop.yTop - side;
      }
    }

    this.renderer.setAttribute(this.prop.element, RECT.X, this.prop.width.toString());
    this.renderer.setAttribute(this.prop.element, RECT.Y, this.prop.height.toString());
    this.renderer.setAttribute(this.prop.element, RECT.WIDTH, side.toString());
    this.renderer.setAttribute(this.prop.element, RECT.HEIGHT, side.toString());
  }

  shiftkeyDownCall(): void {
    if (this.rendering) {
      this.renderSquare(this.lastMouseEvent);
    }
  }

  shiftkeyUpCall(): void {
    if (this.rendering) {
      this.mouseMove(this.lastMouseEvent);
    }
  }

}

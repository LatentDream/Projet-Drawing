import { Injectable,  Renderer2, RendererFactory2 } from '@angular/core';
import { ToolPropEllipse } from '../../../classes/tool-prop-ellipse';
import { ColorService } from '../../color/color.service';
import { ShapeService } from '../shape.service';
import { ELLIPSE } from './../../enum';

@Injectable({
    providedIn: 'root'
  })
  export class EllipseService {

    private renderer: Renderer2;
    private rendering: boolean;
    private parent: HTMLElement;
    private lastMouseEvent: MouseEvent;
    private prop: ToolPropEllipse;

    constructor(renderFactory: RendererFactory2, private shapeService: ShapeService, private colorService: ColorService) {
      this.renderer = renderFactory.createRenderer(null, null);
      this.rendering = false;
      this.prop = new ToolPropEllipse();
      this.shapeService.shapeType = 'contourFilled';
      const ten = 10;
      this.shapeService.strokeWidth = ten;
      const three =  3;
      this.shapeService.nbSides = three;
    }

    mouseDown(event: MouseEvent, itemCount: number): void {
      this.rendering = true;

      this.setParent(event);

      this.prop.xTop = event.offsetX;
      this.prop.yTop = event.offsetY;

      this.prop.element = this.renderer.createElement(ELLIPSE.ELEMENT, ELLIPSE.LINK);
      this.renderer.setAttribute(this.prop.element, 'id', itemCount.toString());
      this.renderer.setAttribute(this.prop.element, 'transform', 'translate(0,0) rotate(0,0,0)');

      switch (this.shapeService.shapeType) {
        case 'contour': { // contour only
          this.renderer.setAttribute(this.prop.element, ELLIPSE.STROKE_WIDTH, this.shapeService.strokeWidth.toString());
          this.renderer.setAttribute(this.prop.element, ELLIPSE.STROKE, this.colorService.secondaryColor);
          this.prop.opacity = 0.0;
          this.renderer.setAttribute(this.prop.element, ELLIPSE.FILL_OPACITY, this.prop.opacity.toString());
          break;
        }
        case 'filled': { // fill only
          this.renderer.setAttribute(this.prop.element, ELLIPSE.STROKE_WIDTH, '0');
          this.renderer.setAttribute(this.prop.element, ELLIPSE.FILL, this.colorService.primaryColor);
          break;
        }
        case 'contourFilled': { // contour and fill
          this.renderer.setAttribute(this.prop.element, ELLIPSE.STROKE, this.colorService.secondaryColor);
          this.renderer.setAttribute(this.prop.element, ELLIPSE.STROKE_WIDTH, this.shapeService.strokeWidth.toString());
          this.renderer.setAttribute(this.prop.element, ELLIPSE.FILL, this.colorService.primaryColor);
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
        // render a ELLIPSE
        if (!event.shiftKey) {
          const x = (Math.abs(event.offsetX - this.prop.xTop) / 2);
          const y = (Math.abs(event.offsetY - this.prop.yTop) / 2);

          if (this.prop.xTop <= event.offsetX) {
            this.prop.rx = (this.prop.xTop + x );
          } else {
            this.prop.rx = (this.prop.xTop - x );
          }

          if (this.prop.yTop <= event.offsetY) {
            this.prop.ry = (this.prop.yTop +  y );
          } else {
            this.prop.ry = (this.prop.yTop - y );
          }

          this.renderer.setAttribute(this.prop.element, ELLIPSE.CX,  this.prop.rx.toString());
          this.renderer.setAttribute(this.prop.element, ELLIPSE.CY, this.prop.ry.toString());
          this.renderer.setAttribute(this.prop.element, ELLIPSE.RX, x.toString());
          this.renderer.setAttribute(this.prop.element, ELLIPSE.RY, y.toString());
        } else {
          this.renderCircle(event);
        }
      }
    }

    mouseUp(event: MouseEvent): void {
      this.rendering = false;
    }

    mouseLeave(): void {
      this.rendering = false;
    }

    renderCircle(event: MouseEvent): void {

      const x = (Math.abs(event.offsetX - this.prop.xTop) / 2);
      const y = (Math.abs(event.offsetY - this.prop.yTop) / 2);
      // largest side
      let side = 0;

      // indentify smallest segment
      if (x < y) {
        side = x;
      } else {
        side = y;
      }

      if (this.prop.xTop <= event.offsetX) {
          this.prop.rx = this.prop.xTop + side;
      } else {
          this.prop.rx = this.prop.xTop - side;
      }
      if (this.prop.yTop <= event.offsetY) {
          this.prop.ry = this.prop.yTop + side;
      } else {
          this.prop.ry = this.prop.yTop - side;
      }

      this.renderer.setAttribute(this.prop.element, ELLIPSE.CX, this.prop.rx.toString());
      this.renderer.setAttribute(this.prop.element, ELLIPSE.CY, this.prop.ry.toString());
      this.renderer.setAttribute(this.prop.element, ELLIPSE.RX, side.toString());
      this.renderer.setAttribute(this.prop.element, ELLIPSE.RY, side.toString());
    }

    shiftkeyDownCall(): void {
      if (this.rendering) {
        this.renderCircle(this.lastMouseEvent);
      }
    }

    shiftkeyUpCall(): void {
      if (this.rendering) {
        this.mouseMove(this.lastMouseEvent);
      }
    }

  }

import { Injectable,  Renderer2, RendererFactory2 } from '@angular/core';
import { LinePoints} from 'src/app/classes/line-points';
import { ToolPropPolygon } from '../../../classes/tool-prop-polygon';
import { ColorService } from '../../color/color.service';
import { ShapeService } from '../shape.service';
import { POLYGON } from './../../enum';

@Injectable({
  providedIn: 'root'
})
export class PolygonService {

  private renderer: Renderer2;
  private rendering: boolean;
  private parent: HTMLElement;
  private linePoints: LinePoints;
  private prop: ToolPropPolygon;

  constructor(renderFactory: RendererFactory2, private shapeService: ShapeService, private colorService: ColorService) {
    this.renderer = renderFactory.createRenderer(null, null);
    this.rendering = false;
    this.prop = new ToolPropPolygon();
    this.linePoints = new LinePoints();
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

    this.prop.element = this.renderer.createElement(POLYGON.ELEMENT, POLYGON.LINK);

    this.linePoints.points = this.prop.xTop.toString() + ',' + this.prop.yTop.toString();
    this.renderer.setAttribute(this.prop.element, POLYGON.POINTS, this.linePoints.points);
    this.renderer.setAttribute(this.prop.element, 'id', itemCount.toString());
    this.renderer.setAttribute(this.prop.element, 'transform', 'translate(0,0) rotate(0,0,0)');

    switch (this.shapeService.shapeType) {
      case 'contour': { // contour only
        this.renderer.setAttribute(this.prop.element, POLYGON.STROKE_WIDTH, this.shapeService.strokeWidth.toString());
        this.renderer.setAttribute(this.prop.element, POLYGON.STROKE, this.colorService.secondaryColor);
        this.prop.opacity = 0.0;
        this.renderer.setAttribute(this.prop.element, POLYGON.FILL_OPACITY, this.prop.opacity.toString());
        break;
      }
      case 'filled': { // fill only
        this.renderer.setAttribute(this.prop.element, POLYGON.STROKE_WIDTH, '0');
        this.renderer.setAttribute(this.prop.element, POLYGON.FILL, this.colorService.primaryColor);
        break;
      }
      case 'contourFilled': { // contour and fill
        this.renderer.setAttribute(this.prop.element, POLYGON.STROKE, this.colorService.secondaryColor);
        this.renderer.setAttribute(this.prop.element, POLYGON.STROKE_WIDTH, this.shapeService.strokeWidth.toString());
        this.renderer.setAttribute(this.prop.element, POLYGON.FILL, this.colorService.primaryColor);
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

    if (this.rendering) {

      this.linePoints.newX = event.offsetX;
      this.linePoints.newY = event.offsetY;

      this.insideAngle();
      this.radiusLenght();

      this.prop.newShape = this.linePoints.points;

      for (let i = 0; i < this.shapeService.nbSides ; i++) {
        const angle = i * this.prop.insideAngleWeight;
        this.nextPoint(angle);
        this.prop.newShape = this.prop.newShape + ' ' + this.prop.nextPoint;
      }
      this.renderer.setAttribute(this.prop.element, POLYGON.POINTS, this.prop.newShape);

    }
  }

  mouseUp(event: MouseEvent): void {
    this.rendering = false;
  }

  mouseLeave(): void {
    this.rendering = false;
  }

  insideAngle(): void {
    this.prop.insideAngleWeight = 2 * Math.PI / this.shapeService.nbSides ;
  }

  radiusLenght(): void {
    const x = Math.pow(this.linePoints.newX - this.prop.xTop, 2);
    const y = Math.pow(this.linePoints.newY - this.prop.yTop, 2);

    this.prop.radiusLenght = Math.pow( x + y, 1 / 2);

  }

  nextPoint(angle: number): void {

    const c = Math.sqrt(2 * Math.pow(this.prop.radiusLenght, 2 ) * ( 1 - Math.cos(angle)));

    let x = c * Math.cos(angle / 2 );
    let y = -c * Math.sin(angle / 2);
    if (this.prop.xTop <= this.linePoints.newX) {
      x = this.prop.xTop - x;
    } else {
      x = this.prop.xTop + x;
    }

    if (this.prop.yTop <= this.linePoints.newY) {
      y = this.prop.yTop - y;
    } else {
      y = this.prop.yTop + y;
    }

    this.prop.nextPoint = x.toString() + ',' + y.toString();

  }

}

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { LineConnectors } from 'src/app/classes/line-connectors';
import { LineParams } from 'src/app/classes/line-params';
import { LinePoints} from 'src/app/classes/line-points';
import { ColorService } from '../color/color.service';
import { CIRCLE, POLYLINE } from '../enum';

@Injectable({
  providedIn: 'root'
})
export class LineService {

  private renderer: Renderer2;
  polyline: SVGElement;
  private parent: HTMLElement;
  linePoints: LinePoints;

  lineConn: LineConnectors;

  private lineParams: LineParams;

  constructor(renderFactory: RendererFactory2, private colorService: ColorService) {
    this.renderer = renderFactory.createRenderer(null, null);
    this.linePoints = new LinePoints();
    this.lineConn = new LineConnectors();
    this.lineParams = new LineParams();
  }

  // Add new line to polyline on mouse click
  mouseClick(event: MouseEvent, itemCount: number): void {

    if (!this.lineParams.rendering) {

      // Start rendering
      this.lineParams.rendering = true;

      // Gets the parent HTMLElement (svg)
      this.setParent(event);

      // Set the starting point of the line
      this.setStart(event, itemCount);
      this.addJunctions();

      // If the line already exists, add another segment to the polyline
    } else {
      this.addLineToPoly();
      this.addJunctions();
    }
  }

  // Visualise line on mouse move
  mouseMove(event: MouseEvent): void {
    if (this.lineParams.rendering) {

      // Retrieve the current mouse position on the canvas
      this.linePoints.newX = event.offsetX;
      this.linePoints.newY = event.offsetY;

      // If shift is pressed while
      if (event.shiftKey) {
        this.renderForcedLine();

        // visualise line
      } else {
        this.renderLine(this.linePoints.newX, this.linePoints.newY);

    }
  }
}

  // End line on double click
  mouseDoubleClick(): void {
    this.lineParams.rendering = false;
    this.lineParams.firstDone = false;
    this.lineConn.connectorsArray = [];
  }

  setStart(event: MouseEvent, itemCount: number): void {

    // Setting the starting position (first line)

    this.linePoints.startX = event.offsetX;
    this.linePoints.startY = event.offsetY;

    // Create polyline element to add to svg
    this.linePoints.points = this.linePoints.startX.toString() + ',' + this.linePoints.startY.toString();
    this.setLast();
    this.polyline = this.renderer.createElement(POLYLINE.ELEMENT, POLYLINE.LINK);
    this.renderer.setAttribute(this.polyline, POLYLINE.POINTS, this.linePoints.points);
    this.renderer.setAttribute(this.polyline, POLYLINE.STROKE_LINEJOIN, 'round');
    this.renderer.setAttribute(this.polyline, POLYLINE.STROKE, this.colorService.primaryColor);
    this.renderer.setAttribute(this.polyline, POLYLINE.STROKE_WIDTH, this.lineParams.strokeWidth.toString());
    this.renderer.setAttribute(this.polyline, POLYLINE.FILL, 'none');
    this.renderer.setAttribute(this.polyline, 'id', itemCount.toString());
    this.renderer.setAttribute(this.polyline, 'transform', 'translate(0,0) rotate(0,0,0)');
    this.renderer.appendChild(this.parent, this.polyline);

    this.lineParams.rendering = true;

  }

  // Fetches the parent element of the draw zone (svg)
  setParent(event: MouseEvent): void {
    if (String((event.target as HTMLElement).nodeName) !== 'svg') {
      this.parent = (event.target as HTMLElement).parentNode as HTMLElement;
    } else {
      this.parent = event.target as HTMLElement;
    }
  }

  // Add line to polyline
  addLineToPoly(): void {
    if (this.linePoints.points != null) {
      const points = this.polyline.getAttribute('points');

      // Officialize the new dot previously visualised
      if (points != null) {
        this.linePoints.points = points;
        this.setLast();

        // After the start has been set, we close the polyline if click at 3 px from start
        if (this.inRangeOfStart() && this.lineParams.firstDone) {
          this.cancelSegment();
          this.renderLine(this.linePoints.startX, this.linePoints.startY);
          this.mouseDoubleClick();

        }
        this.lineParams.firstDone = true;
      }

      // After the start has been set, we close the polyline if click at 3 px from start
      if (this.inRangeOfStart() && this.lineParams.firstDone) {
        this.cancelSegment();
        this.renderLine(this.linePoints.startX, this.linePoints.startY);
        this.mouseDoubleClick();

      }
      this.lineParams.firstDone = true;

    }
  }

  // Visualise the line
  renderLine(x: number, y: number): void {
    this.renderer.setAttribute(this.polyline, POLYLINE.POINTS, this.linePoints.points + ' ' + x + ',' + y);
  }

  // Cancel whole polyline
  cancel(): void {
    this.renderer.setAttribute(this.polyline, POLYLINE.POINTS, '');
    while (this.lineConn.connectorsArray.length !== 0) {
      this.renderer.removeChild(this.parent, this.lineConn.connectorsArray.pop());
    }
    this.mouseDoubleClick();
  }

  // Cancel last segment of polyline
  cancelSegment(): void {
    // cancel

    this.linePoints.points = this.getSubstring();
    this.setLast();
    this.renderLine(this.linePoints.newX, this.linePoints.newY);
    this.cancelJunctions();

    if (this.linePoints.points === '') {
      this.mouseDoubleClick();

    }

  }

  cancelJunctions(): void {
    if (this.lineConn.connectorsArray.length !== 0) {
      this.renderer.removeChild(this.parent, this.lineConn.connectorsArray.pop());
    }

  }

  addJunctions(): void {
    if (this.lineConn.connectorType === 'jonction') {
      // Create connector element to add to svg
      const connector = this.renderer.createElement(CIRCLE.ELEMENT, CIRCLE.LINK);
      this.renderer.setAttribute(connector, CIRCLE.R, this.lineConn.connectorWeight.toString());
      this.renderer.setAttribute(connector, CIRCLE.FILL, this.colorService.primaryColor);
      this.renderer.setAttribute(connector, CIRCLE.CX, this.linePoints.lastX.toString());
      this.renderer.setAttribute(connector, CIRCLE.CY, this.linePoints.lastY.toString());
      this.renderer.appendChild(this.parent, connector);

      this.lineConn.connectorsArray.push(connector);
    }

  }

  // Force the current line at a fixed angle
  renderForcedLine(): void {
    // Get vector from last point to current position
    let x = this.linePoints.newX - this.linePoints.lastX;
    let y = this.linePoints.newY - this.linePoints.lastY;

    // Calculate the quadrant of the current mouse position relative to last position
    let quad: number = (Math.atan(y / x));
    if (x * y < 0) {
      quad += Math.PI;
    }
    const quad8 = 8;
    const quad4 = 4;
    const quad5 = 5;

    quad = Math.round(quad8 * quad / (2 * Math.PI));

    x = this.linePoints.newX;
    y = this.linePoints.newY;
    // force the line angle depending on the quadrant
    if (quad % quad4 === 0) {
      y = this.linePoints.lastY;
    } else if (quad % 2 === 0) {
      x = this.linePoints.lastX;
    } else if (quad === 1 || quad === quad5) {
      y = this.linePoints.lastY - (this.linePoints.lastX - this.linePoints.newX);
    } else {
      y = this.linePoints.lastY + (this.linePoints.lastX - this.linePoints.newX);
    }

    this.renderLine(x, y);

  }

  // Set the lastX and lastY variables with last points added to variable points
  setLast(): void {
    const spaceIndex = this.linePoints.points.lastIndexOf(' ');
    const commaIndex = this.linePoints.points.lastIndexOf(',');

    this.linePoints.lastX = parseInt(this.linePoints.points.substring(spaceIndex, commaIndex), 10);
    this.linePoints.lastY = parseInt(this.linePoints.points.substr(commaIndex + 1), 10);

  }

  // Test if the last position is at 3px from the start
  inRangeOfStart(): boolean {
    const pos = 3;
    const indexX = (Math.abs(this.linePoints.lastX - this.linePoints.startX) <= pos);
    const indexY = (Math.abs(this.linePoints.lastY - this.linePoints.startY) <= pos);
    return (indexY && indexX);
  }

  getSubstring(): string {
    const index = this.linePoints.points.lastIndexOf(' ');
    return this.linePoints.points.substring(0, index);
  }

  shiftkeyUpCall(): void {
    this.renderLine(this.linePoints.newX, this.linePoints.newY);
  }

  shiftkeyDownCall(): void {
    if (this.lineParams.rendering) {
      this.renderForcedLine();
    }
  }

  backspacekeyDownCall(): void {
    this.cancelSegment();
  }

  escapekeyDownCall(): void {
    this.cancel();
  }
}

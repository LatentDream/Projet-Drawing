import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ColorService } from '../color/color.service';
import { BUCKET } from '../enum';

@Injectable({
  providedIn: 'root'
})
export class BucketService {

  tolerance: number;
  renderer: Renderer2;
  img: HTMLImageElement;
  matrixColor: number[][];
  jump: number;

  constructor(private rendererFactory: RendererFactory2, private colorService: ColorService) {
    this.jump = 1;
    this.tolerance = 1;
    this.renderer = this.rendererFactory.createRenderer(null, null);
   }

  mouseDown(event: MouseEvent, itemCount: number): void {
    const parentSVG: HTMLElement = this.setSVG(event);
    this.setImage(event, parentSVG, itemCount);
  }

  setSVG(event: MouseEvent): HTMLElement {
    let currentNode = event.target;
    while ((currentNode as HTMLElement).nodeName !== 'svg') {
      currentNode = (currentNode as HTMLElement).parentNode;
    }
    return currentNode as HTMLElement;
  }

  setImage(event: MouseEvent, parentSVG: HTMLElement, itemCount: number): void {
    this.img = new Image();
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer()
                .serializeToString(parentSVG));
    this.img.src = url;
    this.img.onload =  () => {
      const canvas = this.renderer.createElement('canvas');
      canvas.width = parentSVG.clientWidth;
      canvas.height = parentSVG.clientHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, canvas.width, canvas.height);

      let colorData = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
      const clickValue = this.pickClickValue(colorData[0], colorData[1], colorData[2]);

      this.matrixColor = new Array(this.img.width);
      for (let w = 0; w < this.img.width; w += this.jump) {
        this.matrixColor[w] = new Array(this.img.height).fill(BUCKET.MAX_COLOR);
      }

      let pixelToVisit: number[][] = new Array();
      pixelToVisit.push([event.offsetX, event.offsetY]);
      while (pixelToVisit.length !== 0) {

        const currentPixel: number[] = pixelToVisit.pop() as number[];
        colorData = ctx.getImageData(currentPixel[0], currentPixel[1], 1, 1).data;

        this.matrixColor[currentPixel[0]][currentPixel[1]]
                                      = (Math.abs(clickValue[0] - colorData[0])
                                      + Math.abs(clickValue[1] - colorData[1])
                                      + Math.abs(clickValue[2] - colorData[2]));
        if ((this.matrixColor[currentPixel[0]][currentPixel[1]] - (this.tolerance * BUCKET.TOL_MULTIPLICATOR)) <= 0) {
          pixelToVisit = this.visitPixels(currentPixel, pixelToVisit);
        }
      }
      this.createFill(parentSVG, itemCount);
    };
  }

  pickClickValue(r: number, g: number, b: number): number[] { return [r, g, b]; }

  visitPixels(currentPixel: number[], pixelToVisit: number[][]): number[][] {
    // top pixel
    if ((currentPixel[1] - this.jump  > 0) && (this.matrixColor[currentPixel[0]][currentPixel[1] - this.jump] === BUCKET.MAX_COLOR)) {
      pixelToVisit.push([currentPixel[0], (currentPixel[1] - this.jump)]);
    }
    // left pixel
    if ((currentPixel[0] - this.jump > 0) && (this.matrixColor[(currentPixel[0] - this.jump)][currentPixel[1]] === BUCKET.MAX_COLOR)) {
      pixelToVisit.push([(currentPixel[0] - this.jump), currentPixel[1]]);
    }
    // right pixel
    if (((currentPixel[0] + this.jump) < this.img.width) &&
    (this.matrixColor[(currentPixel[0] + this.jump)][currentPixel[1]] === BUCKET.MAX_COLOR)) {
      pixelToVisit.push([(currentPixel[0] + this.jump), currentPixel[1]]);
    }
    // bottom pixel
    if (((currentPixel[1] + this.jump) < this.img.height) &&
    (this.matrixColor[currentPixel[0]][currentPixel[1] + this.jump] === BUCKET.MAX_COLOR)) {
      pixelToVisit.push([currentPixel[0], (currentPixel[1] + this.jump)]);
    }
    return pixelToVisit;
  }

  createFill(parentSVG: HTMLElement, itemCount: number): void {
    const groupFill = this.renderer.createElement(BUCKET.G, BUCKET.LINK);
    this.renderer.setAttribute(groupFill, BUCKET.STROKE, this.colorService.primaryColor.toString());
    this.renderer.setAttribute(groupFill, BUCKET.STROKE_WIDTH, BUCKET.SWV);
    const tolerance = 7.65;
    let path = '';
    for (let w = 0; w < this.matrixColor.length; w ++) {
      for (let h = 0; h < this.matrixColor[0].length; h ++) {
        if (path.length === 0 && ((this.matrixColor[w][h] - (this.tolerance * BUCKET.TOL_MULTIPLICATOR)) <= 0)) {
          path += 'M' + w + ' ' + h;
        } else if ((this.matrixColor[w][h] - (this.tolerance * tolerance)) <= 0) {
          path += ' L' + w + ' ' + h;
        } else if ((this.matrixColor[w][h] !== 0) && (path.length !== 0)) {
          const pathSVG: SVGElement = this.renderer.createElement(BUCKET.PATH, BUCKET.LINK);
          this.renderer.setAttribute(pathSVG, BUCKET.D, path);
          this.renderer.appendChild(groupFill, pathSVG);
          path = '';
        }
      }
    }
    this.renderer.setAttribute(groupFill, 'id', itemCount.toString());
    this.renderer.setAttribute(groupFill, 'transform', 'translate(0,0) rotate(0,0,0)');
    this.renderer.appendChild(parentSVG, groupFill);
  }
}

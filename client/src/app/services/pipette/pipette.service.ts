import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ColorService } from '../color/color.service';

@Injectable({
  providedIn: 'root'
})
export class PipetteService {

  renderer: Renderer2;
  parent: HTMLElement;
  img: HTMLImageElement;

  constructor(private rendererFactory: RendererFactory2, private colorService: ColorService) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  mouseDown(event: MouseEvent): void {
    this.setParent(event);
    this.getColor(event);
  }

  // Fetches the parent element of the draw zone (svg)
  setParent(event: MouseEvent): void {
    if (String((event.target as HTMLElement).nodeName) !== 'svg') {
      this.parent = (event.target as HTMLElement).parentNode as HTMLElement;
    } else {
      this.parent = event.target as HTMLElement;
    }
  }
  /**
   * Code from this method was inspired by
   * https://stackoverflow.com/questions/28450471/convert-inline-svg-to-base64-string
   */
  getColor(event: MouseEvent): void {
    this.img = new Image();
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(this.parent));
    this.img.src = url;
    this.img.onload =  () => {
      const canvas = this.renderer.createElement('canvas');
      canvas.width = this.parent.clientWidth;
      canvas.height = this.parent.clientHeight;
      const ctx = canvas.getContext('2d');
      const data3 = 3;
      ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, canvas.width, canvas.height);
      const colorData = ctx.getImageData(event.offsetX, event.offsetY, this.img.width, this.img.height).data;
      this.pickColor(event, ('rgba(' + colorData[0] + ',' + colorData[1] + ',' + colorData[2] + ',' + colorData[data3] + ')'));
    };
  }

  pickColor(event: MouseEvent, rgba: string): void {
    if (event.button === 0) {
      this.colorService.primaryColor = rgba;
    } else if (event.button === 2) {
      this.colorService.secondaryColor = rgba;
    }
  }

}

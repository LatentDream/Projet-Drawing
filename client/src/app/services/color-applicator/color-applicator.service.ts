import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ColorService } from '../color/color.service';

@Injectable({
  providedIn: 'root'
})
export class ColorApplicatorService {
  private renderer: Renderer2;

  constructor(private colorService: ColorService, renderFactory: RendererFactory2) {
    this.renderer = renderFactory.createRenderer(null, null);
  }

  mouseDown(event: MouseEvent): void {
    const mouseValue = event.button;
    const targetElement = event.target as SVGElement;

    // on left click
    if (mouseValue === 0) {
      // tslint:disable-next-line: prefer-switch
      if (targetElement.localName === 'path') {
        this.renderer.setAttribute(targetElement, 'stroke', this.colorService.primaryColor);
      } else if (targetElement.localName === 'polyline') {
        this.renderer.setAttribute(targetElement, 'stroke', this.colorService.primaryColor);
      } else if (targetElement.localName === 'circle') {
        this.renderer.setAttribute(targetElement.parentNode, 'fill', this.colorService.primaryColor);
      } else {
        this.renderer.setAttribute(targetElement, 'fill', this.colorService.primaryColor);
      }
    }

    // on right click
    if (mouseValue === 2) {
      // dans ce cas un if est mieux qu'un switch case, comme le code devrait faire le meme code pour les 3 cas specifique.
      // dans un switch case il y aura de la repetition de code
      // tslint:disable-next-line: prefer-switch
      if (targetElement.localName === 'rect' || targetElement.localName === 'ellipse' || targetElement.localName === 'polygon') {
        this.renderer.setAttribute(targetElement, 'stroke', this.colorService.secondaryColor);
      }
    }
  }
}

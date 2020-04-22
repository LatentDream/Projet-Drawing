import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ToolPropRect } from 'src/app/classes/tool-prop-rect';
import { RECT } from '../enum';
@Injectable({
  providedIn: 'root'
})

export class EraseService {

  private renderer: Renderer2;
  private parent: HTMLElement;
  eraserSize: number;
  private squareSVGCreated: boolean;
  private root: SVGSVGElement | null;
  private mouseDownBool: boolean;
  private highlightedElement: SVGElement;
  private previousColor: string;
  private previousStrokeWidth: string;
  private firstItemHighlighted: boolean;
  // tslint:disable-next-line: no-any
  private nodes: any;
  private intersectionFound: boolean;
  private node: number;

  // All attibutes of the svg path
  prop: ToolPropRect;

  constructor(renderFactory: RendererFactory2) {
    this.renderer = renderFactory.createRenderer(null, null);
    this.prop = new ToolPropRect();
    this.squareSVGCreated = false;
    this.mouseDownBool = false;
    this.previousStrokeWidth = '2';
    this.firstItemHighlighted = false;
   }

  mouseDown(event: MouseEvent): void {
    this.mouseDownBool = true;
    this.detectAndDeleteIntersection();
  }

  setParent(event: MouseEvent): void {
    if (String((event.target as HTMLElement).nodeName) !== 'svg') {
      this.parent = (event.target as HTMLElement).parentNode as HTMLElement;
    } else {
      this.parent = event.target as HTMLElement;
    }
  }

  mouseMove(event: MouseEvent): void {
  this.updateSquare(event);
  this.detectAndHighlight();

  if (this.mouseDownBool) {
    this.detectAndDeleteIntersection();
  }

  }

  mouseLeave(): void {
    this.renderer.removeChild(this.parent, this.prop.element);
    this.squareSVGCreated = false;
  }

  mouseClick(event: MouseEvent): void {
    this.detectAndDeleteIntersection();
  }

  mouseUp(event: MouseEvent): void {
    this.mouseDownBool = false;
  }

  updateSquare(event: MouseEvent): void {
    this.setParent(event);
    this.prop.xTop = event.offsetX - this.eraserSize / 2;
    this.prop.yTop = event.offsetY - this.eraserSize / 2;
    if (!this.squareSVGCreated) {
      this.prop.element = this.renderer.createElement(RECT.ELEMENT, RECT.LINK);
      this.renderer.appendChild(this.parent, this.prop.element);
      this.squareSVGCreated = true;
    }
    this.renderer.setAttribute(this.prop.element, RECT.X, this.prop.xTop.toString());
    this.renderer.setAttribute(this.prop.element, RECT.Y, this.prop.yTop.toString());

    this.prop.height = this.eraserSize;
    this.prop.width = this.eraserSize;

    this.renderer.setAttribute(this.prop.element, RECT.HEIGHT, (this.eraserSize).toString());
    this.renderer.setAttribute(this.prop.element, RECT.WIDTH, (this.eraserSize).toString());
    this.renderer.setAttribute(this.prop.element, RECT.FILL, 'white');
    this.renderer.setAttribute(this.prop.element, RECT.STROKE_WIDTH, '3');
    this.renderer.setAttribute(this.prop.element, RECT.STROKE, 'rgb(0,0,0)');
  }

  DoBoxesIntersect(a: DOMRect , b: DOMRect): boolean {
    return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
           (Math.abs(a.y - b.y) * 2 < (a.height + b.height));
  }

  detectAndHighlight(): void {

    // trouve intersection de l'efface et un element svg
    this.intersectionFound = false;
    this.root = this.returnOwnerSVGElement();
    if (this.root) {
      this.nodes = this.root.getIntersectionList(this.root.getBBox(), this.root);
      this.node  = this.nodes.length + 1;
      this.findIntersectionElement();
      // Enelve la mise en evidence si le node n'est plus en intersection avec l'efface
      this.removeHighlight();
      this.highlightElement();
    }
    }

  removeHighlight(): void {
    if (((this.node === this.nodes.length) && this.firstItemHighlighted)  || ((this.highlightedElement !== this.nodes[this.node])
      && this.firstItemHighlighted)) {
        if (this.highlightedElement.parentNode) {
          if (this.highlightedElement.parentNode.nodeName === 'g') {
            if (this.highlightedElement.localName === 'circle') {
              this.renderer.setAttribute(this.highlightedElement.parentNode, 'fill', this.previousColor);
            }
            if (this.highlightedElement.localName === 'path') {
              console.log(this.highlightedElement.parentNode);
              this.renderer.setAttribute(this.highlightedElement.parentNode, 'stroke', this.previousColor);
            }
          } else {
            // tslint:disable-next-line: prefer-switch
            if ( this.highlightedElement.localName === 'circle' ) {
              this.renderer.setAttribute(this.highlightedElement, 'fill', this.previousColor);
            } else if (this.highlightedElement.localName === 'polyline') {
              this.renderer.setAttribute(this.highlightedElement, 'stroke', this.previousColor);
            // tslint:disable-next-line: prefer-switch
            } else if (this.highlightedElement.localName === 'path') {
              this.renderer.setAttribute(this.highlightedElement, 'stroke', this.previousColor);
            } else if (this.highlightedElement.localName === 'ellipse') {
              this.renderer.setAttribute(this.highlightedElement, 'stroke', this.previousColor);
              this.renderer.setAttribute(this.highlightedElement, RECT.STROKE_WIDTH, this.previousStrokeWidth);
            } else if (this.highlightedElement.localName === 'polygon') {
              this.renderer.setAttribute(this.highlightedElement, 'stroke', this.previousColor);
              this.renderer.setAttribute(this.highlightedElement, RECT.STROKE_WIDTH, this.previousStrokeWidth);
            } else if (this.highlightedElement.localName === 'rect') {
              this.renderer.setAttribute(this.highlightedElement, 'stroke', this.previousColor);
              this.renderer.setAttribute(this.highlightedElement, RECT.STROKE_WIDTH, this.previousStrokeWidth);
            }
          }
        }
      }
  }

  highlightElement(): void {
    if (this.parent && this.nodes[this.node]) {
      if (this.getColor(this.nodes[this.node]) !== 'red') {
        this.highlightedElement = this.nodes[this.node];
        this.previousColor = this.getColor(this.nodes[this.node]);
        if (this.nodes[this.node].parentNode) {
          if (this.nodes[this.node].parentNode.localName === 'g' && this.nodes[this.node].localName === 'circle') {
            this.renderer.setAttribute((this.nodes[this.node].parentNode as SVGAElement), 'fill', 'red');
          } else if (this.nodes[this.node].parentNode.localName === 'g' && this.nodes[this.node].localName === 'path') {
            this.renderer.setAttribute((this.nodes[this.node].parentNode as SVGAElement), 'stroke', 'red');
          }  else if (this.nodes[this.node].localName === 'polyline') {
            this.renderer.setAttribute(this.nodes[this.node], RECT.STROKE_WIDTH, this.previousStrokeWidth);
            this.renderer.setAttribute(this.nodes[this.node], RECT.STROKE, 'red');
          } else if (this.nodes[this.node].parentNode.localName === 'svg') {
            this.renderer.setAttribute(this.nodes[this.node], RECT.STROKE_WIDTH, this.previousStrokeWidth);
            this.renderer.setAttribute(this.nodes[this.node], RECT.STROKE, 'red');
          }
        }
        if (!this.firstItemHighlighted) {
          this.firstItemHighlighted = true;
        }
      }
    }
  }

  findIntersectionElement(): void {
    for (let i = 0; i < this.nodes.length; i ++) {
      if (this.nodes[i] !== this.prop.element) {
        const eraserRect = this.prop.element.getBoundingClientRect() as DOMRect;
        const nodeRect = this.nodes[i].getBoundingClientRect() as DOMRect;
        this.intersectionFound = this.DoBoxesIntersect(eraserRect, nodeRect);
        if (this.intersectionFound) {
          this.node = i;
        }
      }
    }
  }

  getColor(element: SVGElement): string {
    let color = '';
    if (element.localName === 'rect') {
      color = element.getAttribute('stroke') as string;
      this.previousStrokeWidth = element.getAttribute('stroke-width') as string;
    }
    if (element.localName === 'path') {
      color = element.getAttribute('stroke') as string;
      this.previousStrokeWidth = element.getAttribute('stroke-width') as string;
    }

    if ((element.localName === 'circle') && (element.parentNode as HTMLElement).nodeName === 'g') {
      color = element.getAttribute('fill') as string;
      this.previousStrokeWidth = element.getAttribute('r') as string;
    }

    if (element.localName === 'ellipse') {
      color = element.getAttribute('stroke') as string;
      this.previousStrokeWidth = element.getAttribute('stroke-width') as string;
    }

    if (element.localName === 'polyline') {
      color = element.getAttribute('stroke') as string;
      this.previousStrokeWidth = element.getAttribute('stroke-width') as string;
    }
    if (element.localName === 'polygon') {
      color = element.getAttribute('stroke') as string;
      this.previousStrokeWidth = element.getAttribute('stroke-width') as string;
    }

    return color;
  }

  returnOwnerSVGElement(): SVGSVGElement | null {
    if (this.prop.element.ownerSVGElement) {
    return this.prop.element.ownerSVGElement as SVGSVGElement;
    } else {
      return null;
    }
  }

  deleteElement(): void {
    if (this.parent && this.nodes[this.node]) {
      if (this.nodes[this.node].localName === 'circle' && this.nodes[this.node].parentNode.localName === 'g') {
        this.renderer.removeChild(this.parent, this.nodes[this.node].parentNode);
      } else if (this.nodes[this.node].localName === 'path' && this.nodes[this.node].parentNode.localName === 'g') {
        this.renderer.removeChild(this.parent, this.nodes[this.node].parentNode);
      } else {
        this.renderer.removeChild(this.parent, this.nodes[this.node]);
      }
    }
  }

  detectAndDeleteIntersection(): void {
    this.root = this.returnOwnerSVGElement();
    if (this.root) {
    this.nodes = this.root.getIntersectionList(this.root.getBBox(), this.root);
    this.node = this.nodes.length;
    this.intersectionFound = false;
    this.findIntersectionElement();
    this.deleteElement();
    }
  }

}

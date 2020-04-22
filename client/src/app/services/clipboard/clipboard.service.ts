import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ClickEventDispatcherService } from '../dispatcher/click-event-dispatcher.service';
import { SelectionService } from '../selection/selection.service';
@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  clipboard: SVGElement[];
  canvas: SVGElement;
  renderer: Renderer2;
  chainedPaste: number;
  chainedPasteOffset: number;
  transformOffset: {x: number, y: number};
  constructor(private selectionService: SelectionService, private rf: RendererFactory2, private CEDS: ClickEventDispatcherService) {
    this.clipboard = [];
    this.renderer = this.rf.createRenderer(null, null);
    this.chainedPaste = 1;
    this.chainedPasteOffset = 0;
  }

  action(key: string): void {
    this.canvas = this.CEDS.canvas;
    switch (key) {
      case 'c': {
        this.copy();
        break;
      }
      case 'v': {
        this.paste();
        break;
      }
      case 'd': {
        this.duplicate();
        break;
      }
      case 'x': {
        this.cut();
        break;
      }
    }
  }

  copy(): void {
    if (this.selectionService.selectionParameters.selectedItems.size !== 0) {
      this.chainedPaste = 1;
      this.chainedPasteOffset = 0;
      this.transformOffset = {x: this.selectionService.selectionParameters.rightSelectedItemsBox, y:
                              this.selectionService.selectionParameters.bottomSelectedItemsBox};
      this.clipboard = [];
      this.selectionService.selectionParameters.selectedItems.forEach((el) => {
        this.clipboard.push(el.cloneNode() as SVGElement);
      });
      console.log(this.clipboard);
    }
  }

  paste(): void {
    if (this.clipboard.length !== 0) {
      this.clipboard.forEach((el) => {
        const copy = el.cloneNode() as SVGElement;
        this.CEDS.itemCount++;
        const id = this.CEDS.itemCount.toString();
        this.renderer.setAttribute(copy, 'id', id);
        const transform = this.selectionService.findMatrixValues(copy);
        const twenty = 20;
        if ( this.transformOffset.x > this.canvas.clientLeft + this.canvas.clientWidth ||
            this.transformOffset.y > this.canvas.clientTop + this.canvas.clientHeight) {
          this.chainedPaste = 1;
          this.chainedPasteOffset += twenty;
        }
        this.renderer.setAttribute(copy, 'transform',
          'translate('
          + (Number(transform.get('xTranslation')) + this.chainedPaste * twenty * this.clipboard.length) + ','
          + (Number(transform.get('yTranslation')) + this.chainedPaste * twenty * this.clipboard.length - this.chainedPasteOffset)
          + ') rotate('
          + transform.get('dRotation') + ','
          + transform.get('xRotation') + ','
          + transform.get('yRotation') + ')');

        this.renderer.appendChild(this.canvas, copy);
        this.transformOffset = {x: copy.getBoundingClientRect().right, y: copy.getBoundingClientRect().bottom};
        this.selectionService.selectionParameters.selectedItems.set(id, copy);
      });

      this.selectionService.updateForClipboard(this.canvas, false);
      console.log('paste');
      this.chainedPaste++;
    }
  }

  duplicate(): void {
    console.log('duplicate');
    this.copy();
    this.paste();
  }

  cut(): void {
    this.copy();
    this.delete();
    console.log('cut');
  }

  delete(): void {
    if (this.selectionService.selectionParameters.selectedItems.size !== 0) {
      this.selectionService.selectionParameters.selectedItems.forEach((el) => {
        this.renderer.removeChild(this.canvas, el);
      });
      this.selectionService.updateForClipboard(this.canvas, true);
      console.log('delete');
    }
  }
}

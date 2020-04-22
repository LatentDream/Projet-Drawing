import { Action, ApplicatorData, ObserverParam } from '../../classes/action';

import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ClickEventDispatcherService } from '../dispatcher/click-event-dispatcher.service';
import { EraseService } from '../erase/erase.service';
import { UNDOREDOCONSTANTE } from './enum';

@Injectable({
  providedIn: 'root'
})

export class UndoRedoService {

  element: ElementRef;
  addRemoveOB: ObserverParam;

  attributesOB: ObserverParam;
  renderer: Renderer2;
  undoQueue: Action[];
  redoQueue: Action[];
  unableToUndo: boolean;
  unableToRedo: boolean;

  constructor(private rendererFactory: RendererFactory2, private CEDS: ClickEventDispatcherService, private eraser: EraseService) {
    // Initialise attribute values
    this.addRemoveOB = new ObserverParam();
    this.attributesOB = new ObserverParam();
    this.addRemoveOB.config = { childList: true };
    this.attributesOB.config = {
      childList: true, attributes: true,
      attributeOldValue: true, subtree: true, attributeFilter: ['stroke', 'fill', 'transform']
    };
    this.unableToUndo = true;
    this.unableToRedo = true;
    this.undoQueue = [];
    this.redoQueue = [];
    // Callback function when an element is added to the svg
    this.addRemoveOB.callback = (mutaList: MutationRecord[]) => {
      mutaList.forEach((mutation: MutationRecord) => {
        if (mutation.type === 'childList') {

          const addedNodesList: Node[] = [];
          const removedNodesList: Node[] = [];
          mutation.addedNodes.forEach((node) => {
            if (node !== this.eraser.prop.element as Node
              && (node as Element).id !== 'selectedItemsRect'
              && (node as Element).id !== 'selectionRect') {
              addedNodesList.push(node);
            }
          });
          mutation.removedNodes.forEach((node) => {
            if (node !== this.eraser.prop.element as Node
              && (node as Element).id !== 'selectedItemsRect'
              && (node as Element).id !== 'selectionRect') {
              removedNodesList.push(node); console.log(node);
            }
          });

          if (addedNodesList.length !== 0) {
            this.redoQueue = [];
            this.undoQueue.push(new Action('add', addedNodesList));
            this.update();
          }

          if (removedNodesList.length !== 0) {
            this.redoQueue = [];
            this.undoQueue.push(new Action('remove', removedNodesList));
            this.update();
          }
        }
      });
    };

    this.attributesOB.callback = (mutaList: MutationRecord[]) => {
      mutaList.forEach((mutation: MutationRecord) => {
        if (mutation.type === 'attributes') {
          if (this.CEDS.currentTool !== 'eraser' && mutation.attributeName !== null && mutation.oldValue !== null) {

            if (CEDS.currentTool === 'applicator') {
              this.redoQueue = [];
              this.undoQueue.push(new Action('applicator', new ApplicatorData(mutation.target as HTMLElement,
                mutation.attributeName, mutation.oldValue)));
              this.update();
            }
            if (CEDS.currentTool === 'selection') {
              this.redoQueue = [];
              this.undoQueue.push(new Action('move', [mutation.target, mutation.oldValue]));
              this.update();
            }
          }
        }
      });
    };
    // Initialise observer
    this.addRemoveOB.observer = new MutationObserver(this.addRemoveOB.callback);
    this.attributesOB.observer = new MutationObserver(this.attributesOB.callback);
  }

  // Set svg element from the DOMs and initialise renderer
  // target peut etre de plusieurs type
  // tslint:disable-next-line: no-any
  setElement(el: any): void {
    this.element = new ElementRef<HTMLElement>(el);
    this.renderer = this.rendererFactory.createRenderer(this.element, null);
    console.log(this.element);
    this.enable();
  }

  // Start observation of svg element
  enable = () => {
    this.addRemoveOB.observer.observe(this.element.nativeElement, this.addRemoveOB.config);
    this.attributesOB.observer.observe(this.element.nativeElement, this.attributesOB.config);
  }

  // Stop observation of svg element
  disable(): void {
    this.addRemoveOB.observer.disconnect();
    this.attributesOB.observer.disconnect();
  }

  // Reapply last action on canvas
  undo(): void {
    this.disable();
    const action = this.undoQueue.pop();
    if (action !== undefined) {
      this.redoQueue.push(action);
      this.undoSwitch(action);
    }
    this.update();
    setTimeout(this.enable, UNDOREDOCONSTANTE._100);
  }

  undoSwitch(action: Action): void {
    switch (action.type) {
      case 'add': {
        action.target.forEach((node: Node) => {
          this.renderer.removeChild(this.element.nativeElement, node);
        });
        break;
      }
      case 'remove': {
        action.target.forEach((node: Node) => {
          this.renderer.appendChild(this.element.nativeElement, node);
        });
        if (this.undoQueue.length !== 0 && this.undoQueue[this.undoQueue.length - 1].type === 'remove') { this.undo(); }
        break;
      }
      case 'applicator': {
        const oldTemp = action.target.element.getAttribute(action.target.attName);
        this.renderer.setAttribute(action.target.element, action.target.attName, action.target.oldValue);
        action.target.oldValue = oldTemp;
        break;
      }
      case 'move': {
        this.renderer.setAttribute(action.target[0], 'transform', action.target[1]);
        if (this.undoQueue.length !== 0 && this.undoQueue[this.undoQueue.length - 1].type === 'move') {
          this.undo();
        }
        break;
      }
    }
  }

  // Reapply last undo action on canvas
  redo(): void {
    this.disable();
    const action = this.redoQueue.pop();
    if (action !== undefined) {
      this.undoQueue.push(action);
      this.redoSwitch(action);
    }
    this.update();
    setTimeout(this.enable, UNDOREDOCONSTANTE._100);
  }

  redoSwitch(action: Action): void {
    switch (action.type) {
      case 'add': {
        action.target.forEach((node: Node) => {
          this.renderer.appendChild(this.element.nativeElement, node);
        });
        break;
      }
      case 'remove': {
        action.target.forEach((node: Node) => {
          this.renderer.removeChild(this.element.nativeElement, node);
        });
        if (this.redoQueue.length !== 0 && this.redoQueue[this.redoQueue.length - 1].type === 'remove') { this.redo(); }
        break;
      }
      case 'applicator': {
        const at = action.target as ApplicatorData;
        const oldTemp = at.element.getAttribute(at.attName);
        this.renderer.setAttribute(at.element, at.attName as string, at.oldValue as string);
        action.target.oldValue = oldTemp;
        break;
      }
      case 'move': {
        this.renderer.setAttribute(action.target[0], 'transform', action.target[1]);
        if (this.redoQueue.length !== 0 && this.redoQueue[this.redoQueue.length - 1].type === 'move') {
          this.redo();
        }
        break;
      }
    }
  }

  // Update buttons availability
  update(): void {
    this.unableToUndo = (this.undoQueue.length === 0);
    this.unableToRedo = (this.redoQueue.length === 0);
  }

}

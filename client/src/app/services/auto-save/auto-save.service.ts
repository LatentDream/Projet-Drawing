import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ObserverParam } from 'src/app/classes/action';
import { ClickEventDispatcherService } from '../dispatcher/click-event-dispatcher.service';
import { AUTOSAVE } from './auto-save.enum';

@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {

  element: ElementRef;
  addRemoveOB: ObserverParam;
  attributesOB: ObserverParam;
  renderer: Renderer2;

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Constructor and bind the change to the auto-save function
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  constructor(private rendererFactory: RendererFactory2, private CEDS: ClickEventDispatcherService) {
    // Initialise attribute values
    this.addRemoveOB = new ObserverParam();
    this.attributesOB = new ObserverParam();
    this.addRemoveOB.config = { childList: true };
    this.attributesOB.config = { childList: true, attributes: true,
      attributeOldValue: true, subtree: true, attributeFilter: ['stroke', 'fill']};
    // Callback function when an element is added to the svg
    this.addRemoveOB.callback = (mutaList: MutationRecord[]) => {
      mutaList.forEach((mutation: MutationRecord) => {
        if (mutation.type === 'childList') {
          this.save();
        }
      });
    };

    this.attributesOB.callback = (mutaList: MutationRecord[]) => {
      mutaList.forEach((mutation: MutationRecord) => {
          this.save();
      });
    };
    // Initialise observer
    this.addRemoveOB.observer = new MutationObserver(this.addRemoveOB.callback);
    this.attributesOB.observer = new MutationObserver(this.attributesOB.callback);
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Set observer to observe el
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  setElement(el: Element): void {
    this.element = new ElementRef<HTMLElement>(el as HTMLElement);
    this.renderer = this.rendererFactory.createRenderer(this.element, null);
    this.enable();
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * Set observer to observe el
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  enable = () => {
    this.addRemoveOB.observer.observe(this.element.nativeElement, this.addRemoveOB.config);
    this.attributesOB.observer.observe(this.element.nativeElement, this.attributesOB.config);
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * create a copie of the drawing in the local storage
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  save(): void {
    const srx = new XMLSerializer();
    localStorage.setItem(AUTOSAVE.LOCATION, srx.serializeToString(this.CEDS.canvas));
  }

}

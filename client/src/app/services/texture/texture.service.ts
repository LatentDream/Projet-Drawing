import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextureService {

  filterTurbulence: HTMLElement;
  filterBlurry: HTMLElement;
  filterBase: HTMLElement;
  filterNoise: HTMLElement;
  filterSquigly: HTMLElement;

  constructor() {
    return;
   }
}

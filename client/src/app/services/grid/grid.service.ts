import { Injectable } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { GRID } from 'src/app/services/enum';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  gridIsActive: boolean;
  scale: number;
  path: string;
  opacity: number;
  constructor() {
    this.scale = GRID.BASE_SCALE;
    this.path = GRID.BASE_PATH;
    this.opacity = GRID.BASE_OPACITY;
    this.gridIsActive = false;
  }

  toggleGrid(): void {
    this.gridIsActive = !this.gridIsActive;
  }

  scaleChange(event: MatSliderChange): void {
    if (event.value != null) {
      this.scale = event.value;
      this.path = 'M ' + this.scale.toString() + ' 0 L 0 0 0 ' + this.scale.toString();
    }
  }

  opacityChange(event: MatSliderChange): void {
    if (event.value != null) {
      this.opacity = event.value;
    }
  }

  increment(): void {
    const scale5 = 5;
    if (this.scale + scale5 <= GRID.MAX_SCALE) {
      this.scale += scale5;
      this.path = 'M ' + this.scale.toString() + ' 0 L 0 0 0 ' + this.scale.toString();
    }
  }

  decrement(): void {
    const scale5 = 5;
    if (this.scale - scale5 >= GRID.MIN_SCALE) {
    this.scale -= scale5;
    this.path = 'M ' + this.scale.toString() + ' 0 L 0 0 0 ' + this.scale.toString();
    }
  }
}

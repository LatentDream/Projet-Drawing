import { Injectable } from '@angular/core';
import { ColorService } from '../color/color.service';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  // common attributes
  shapeType: string;
  strokeWidth: number;
  nbSides: number;

  constructor(public colorService: ColorService) {}
}

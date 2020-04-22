import { Component } from '@angular/core';
import { MatButtonToggleChange, MatRadioChange, MatSliderChange } from '@angular/material';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { ShapeService } from 'src/app/services/shape/shape.service';
import { SHAPE } from '../../enum';

@Component({
  selector: 'app-shape-tap',
  templateUrl: './shape-tap.component.html',
  styleUrls: ['./shape-tap.component.scss']
})
export class ShapeTAPComponent {

  selectedSide: string;
  constructor(private clickEventDispatcher: ClickEventDispatcherService,
              private shapeService: ShapeService) { }

  updateSliderValueShape(event: MatSliderChange): void {
    if (event.value === null) {
     this.shapeService.strokeWidth = SHAPE.BASESTROKEWIDTH;
    } else {
      this.shapeService.strokeWidth = event.value;
    }
  }

  updateShapeType(event: MatRadioChange): void {
    if (event.value !== null) {
      this.shapeService.shapeType = event.value;
    }
  }

  toolChange(event: MatButtonToggleChange): void {
    if (event.value !== null) {
      this.clickEventDispatcher.setCurrentTool(event.value);
    }
  }

  updateNumberSide(): void {
    this.shapeService.nbSides = parseInt(this.selectedSide, 10);
  }

}

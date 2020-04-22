import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { GridService } from 'src/app/services/grid/grid.service';

@Component({
  selector: 'app-grid-tap',
  templateUrl: './grid-tap.component.html',
  styleUrls: ['./grid-tap.component.scss']
})
export class GridTAPComponent {

  // Logic in GridService
  constructor(private gridService: GridService) { }

  scaleChange(event: MatSliderChange): void {
    this.gridService.scaleChange(event);
  }
  opacityChange(event: MatSliderChange): void {
    this.gridService.opacityChange(event);
  }
}

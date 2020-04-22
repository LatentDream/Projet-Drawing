import { Component } from '@angular/core';
import { GridService } from 'src/app/services/grid/grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  scale: number;
  // Logic in gridService
  constructor( private gridService: GridService) {
    this.scale = this.gridService.scale;
  }
}

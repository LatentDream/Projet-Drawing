import { Component } from '@angular/core';
import { MatRadioChange, MatSliderChange } from '@angular/material';
import { LineService } from '../../../services/line/line.service';

@Component({
  selector: 'app-line-tap',
  templateUrl: './line-tap.component.html',
  styleUrls: ['./line-tap.component.scss']
})
export class LineTAPComponent {

  show: boolean;
  constructor(private lineService: LineService) {
    this.show = false;
  }

  // slider for line weight
  updateSliderValueLine(event: MatSliderChange): void {

    const lineParamsStr = 'lineParams';

    if (event.value === null) {
      this.lineService[lineParamsStr].strokeWidth = 1;
    } else {
      this.lineService[lineParamsStr].strokeWidth = event.value as number;
    }
  }

  // connector type
  updateConnectorsType(event: MatRadioChange): void {
    const lineConnStr = 'lineConn';
    if (event.value !== null) {
      this.show = !this.show;
      this.lineService[lineConnStr].connectorType = event.value;
    }
  }

  // slider for junction weight
  updateSliderValueConnectors(event: MatSliderChange): void {
    const lineConnStr = 'lineConn';
    if (event.value === null) {
      this.lineService[lineConnStr].connectorWeight = 1;
    } else {
      this.lineService[lineConnStr].connectorWeight = event.value;
    }
  }

}

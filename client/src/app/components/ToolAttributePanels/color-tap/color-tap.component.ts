import { Component } from '@angular/core';
import { MatButtonToggleChange, MatSliderChange } from '@angular/material';
import { BucketService } from 'src/app/services/bucket/bucket.service';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { COLOR } from '../../enum';
@Component({
  selector: 'app-color-tap',
  templateUrl: './color-tap.component.html',
  styleUrls: ['./color-tap.component.scss']
})
export class ColorTAPComponent {

  buttonValue: string;
  constructor(private clickEventDispatcher: ClickEventDispatcherService,
              private bucketService: BucketService) {
    this.buttonValue = COLOR.BUCKET;
  }

  toolChange(event: MatButtonToggleChange): void {
    this.clickEventDispatcher.setCurrentTool(event.value);
    this.buttonValue = event.value;
  }

  changeTolerance(event: MatSliderChange): void {
    if (event.value !== null) {
      this.bucketService.tolerance = event.value;
    }
  }

}

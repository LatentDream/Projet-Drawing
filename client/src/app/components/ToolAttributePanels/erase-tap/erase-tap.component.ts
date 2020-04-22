import { Component, OnInit} from '@angular/core';
import {MatSliderChange } from '@angular/material';
import {EraseService} from '../../../services/erase/erase.service';

@Component({
  selector: 'app-erase-tap',
  templateUrl: './erase-tap.component.html',
  styleUrls: ['./erase-tap.component.scss']
})

export class EraseTapComponent implements OnInit {

  constructor(private eraseService: EraseService, ) {}

  ngOnInit(): void {
    const three = 3;
    this.eraseService.eraserSize = three;
  }

  updateSliderValueConnectors(event: MatSliderChange): void {
    if (event.value === null) {
      const three = 3;
      this.eraseService.eraserSize = three;
    } else {
      this.eraseService.eraserSize = event.value as number;
    }
  }

}

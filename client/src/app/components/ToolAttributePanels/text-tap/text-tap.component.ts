import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { TextService } from '../../../services/text/text.service';

@Component({
  selector: 'app-text-tap',
  templateUrl: './text-tap.component.html',
  styleUrls: ['./text-tap.component.scss']
})
export class TextTAPComponent  {

  fonts: string[] = [
    'Times New Roman',
    'Arial',
    'Lucida Console',
    'Verdana',
    'Garamond',
    'Comic Sans MS',
    'Lucida Sans Unicode',
    'Tahoma',
    'Courier',
    'Trebuchet MS',
    'Palatino Linotype',
];

currentFontFamily: string;
constructor(private textService: TextService) {
}

updateFontSize(event: MatSliderChange): void {
  const textParamsStr = 'textParams';
  const defaultSize = 10;
  if (event.value === null) {
    this.textService[textParamsStr].fontWeight = defaultSize;
  } else {
    this.textService[textParamsStr].fontWeight = event.value;
  }
}

updateFontFamily(font: string): void {
  this.currentFontFamily = font;
  const textParamsStr = 'textParams';
  this.textService[textParamsStr].fontFamily = this.currentFontFamily;
  this.textService.updateFF();
}

// Italic
updateFontStyle(style: string): void {
  const textParamsStr = 'textParams';
  this.textService[textParamsStr].fontStyle = style.valueOf();
  if (style.valueOf() === 'italic') {
    this.textService.updateStyle();
  } else {
    this.textService.updateWeight();
  }
}

updateTextAlign(align: string): void {
  const textParamsStr = 'textParams';
  this.textService[textParamsStr].align = align;
  this.textService.updateAlign();
}

}

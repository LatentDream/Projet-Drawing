import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import {ColorToolVariables} from 'src/app/classes/color-tool-variables';
import {ColorService } from 'src/app/services/color/color.service';
import {ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';

@Component({
  selector: 'app-color-tool',
  templateUrl: './color-tool.component.html',
  styleUrls: ['./color-tool.component.scss']
})
export class ColorToolComponent {
  private colorVariables: ColorToolVariables;
  @ViewChild('primary', {static: false})
  primary: ElementRef<HTMLElement>;

  @ViewChild('secondary', {static: false})
  secondary: ElementRef<HTMLElement>;

  @ViewChild('background', {static: false})
  background: ElementRef<HTMLElement>;

  @ViewChild('paletteRef', {static: false})
  palette: ElementRef<Component>;

  @ViewChild('valRHex', {static: false})
  valRHex: ElementRef;

  @ViewChild('valGHex', {static: false})
  valGHex: ElementRef;

  @ViewChild('valBHex', {static: false})
  valBHex: ElementRef;

  constructor(private colorService: ColorService,  private renderer: Renderer2,
              private clickEventDispatcher: ClickEventDispatcherService) {
      this.colorVariables = new ColorToolVariables();
      this.colorVariables.transparencyChanged = false;
      this.colorVariables.hideColorPicker = false;
  }

  saveColor(): void {
    if (this.colorVariables.color) {
      switch (this.colorVariables.currentColorSeclection) {
        case 0:
          this.colorService.primaryColor = this.colorVariables.color;
          this.primary.nativeElement.style.backgroundColor = this.colorVariables.color;
          this.colorService.addColor(this.colorVariables.color, this.colorVariables.transparencyChanged);
          break;
        case 1:
          this.colorService.secondaryColor = this.colorVariables.color;
          this.secondary.nativeElement.style.backgroundColor = this.colorVariables.color;
          this.colorService.addColor(this.colorVariables.color, this.colorVariables.transparencyChanged);
          break;
        case 2:
          this.colorService.backgroundColor = this.colorVariables.color;
          this.renderer.setAttribute(this.clickEventDispatcher.canvas, 'style', 'background: '.concat(this.colorService.backgroundColor));
          this.background.nativeElement.style.backgroundColor = this.colorVariables.color;
          this.colorService.addColor(this.colorVariables.color, this.colorVariables.transparencyChanged);
          break;
        default:
          break;
      }
    }
  }

  switchColors(): void  {
    const primaryHolder = this.colorService.primaryColor;
    const secondaryHolder = this.colorService.secondaryColor;
    this.primary.nativeElement.style.backgroundColor = secondaryHolder;
    this.colorService.primaryColor = secondaryHolder;
    this.secondary.nativeElement.style.backgroundColor = primaryHolder;
    this.colorService.secondaryColor = primaryHolder;
  }

  validateColorEntered(): void  {
    const rdecimal = parseInt(this.valRHex.nativeElement.value, 16);
    const gdecimal = parseInt(this.valGHex.nativeElement.value, 16);
    const bdecimal = parseInt(this.valBHex.nativeElement.value, 16);
    const value = 256;
    if (rdecimal < value && gdecimal < value && bdecimal < value) {
      this.colorVariables.color = 'rgba(' + rdecimal + ',' + gdecimal + ',' + gdecimal + ',1)';
      this.colorVariables.hideColorPicker = true;
      this.saveColor();
    } else {
      alert("La valeur d'entrée devrait entre 0 et FF en hexa");
    }
  }

  updateSliderValue(event: MatSliderChange): void  {
    let commaCounter = 0;
    let valueChanged = false;
    let transparencyValue = 1;
    let newColor = '';
    let stringLength = 0;

    // if color is not chosen yet, do not update string length
    if (this.colorVariables.color) {
      stringLength = this.colorVariables.color.length;
    }

    // ensures that the value of event is not null
    if (event.value) {
      const hundred = 100;
      transparencyValue = event.value / hundred;
    }

    for (let i = 0; i < stringLength - 1 && !valueChanged; i++) {
      if (this.colorVariables.color[i] === ',') {
        commaCounter ++;
      }
      const three = 3;
      if (commaCounter === three) {
        newColor += ',' + transparencyValue.toString() + ')';
        valueChanged = true;
      } else {
        newColor += this.colorVariables.color[i];
      }
    }
    this.colorVariables.color = newColor;
    this.colorVariables.transparencyChanged = true;
    this.saveColor();
  }

  // add event emitter to this funciton
  colorClickedInHistory(event: MouseEvent, dotNum: number): void  {
    if (this.colorService.queue.data[dotNum]) {
      if (event.button === 0) {
        this.colorVariables.color = this.colorService.queue.data[dotNum];
        this.colorVariables.currentColorSeclection = 0;
        this.colorVariables.hideColorPicker = true;
        this.saveColor();
      }
    }
  }

  colorRightClickedInHistory(event: MouseEvent, dotNum: number): boolean  {
    if (this.colorService.queue.data[dotNum]) {
      if (event.button === 2) {
        this.colorVariables.color = this.colorService.queue.data[dotNum];
        this.colorVariables.currentColorSeclection = 1;
        this.colorVariables.hideColorPicker = false;
        this.saveColor();
      }
    }
    return false;
  }

  primaryColorClicked(): void  {
    this.colorVariables.color = this.colorService.primaryColor;
    this.colorVariables.hideColorPicker = false;
    this.colorVariables.currentColorSeclection = 0;
  }

  secondaryColorClicked(): void  {
    this.colorVariables.color = this.colorService.secondaryColor;
    this.colorVariables.hideColorPicker = false;
    this.colorVariables.currentColorSeclection = 1;
  }

  backgroundColorClicked(): void {
    this.colorVariables.color = this.colorService.backgroundColor;
    this.colorVariables.hideColorPicker = false;
    this.colorVariables.currentColorSeclection = 2;
  }

}

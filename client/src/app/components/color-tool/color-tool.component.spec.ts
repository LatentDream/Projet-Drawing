import { APP_BASE_HREF } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatSliderChange} from '@angular/material/slider';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { ColorToolComponent } from './color-tool.component';

describe('ColorToolComponent', () => {
  let component: ColorToolComponent;
  let fixture: ComponentFixture<ColorToolComponent>;
  let renderer: Renderer2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    renderer = jasmine.createSpyObj('Renderre2', ['setAttribute']);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save primary color in color service', () => {
    const colorVariables = 'colorVariables';
    component[colorVariables].color = 'rgba(0, 0, 0)';
    const colorService = 'colorService';
    component.primaryColorClicked();
    component.saveColor();
    expect(component[colorService].primaryColor).toEqual('rgba(0, 0, 0)');
  });

  it('should NOT save primary color if color is underfined', () => {
    const colorService = 'colorService';
    const spy = spyOn(component[colorService], 'addColor').and.callThrough();
    component.saveColor();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should save secondary color in color service', () => {
    const colorVariables = 'colorVariables';
    component[colorVariables].color = 'rgba(0, 0, 0)';
    const colorService = 'colorService';
    component.secondaryColorClicked();
    component.saveColor();
    expect(component[colorService].secondaryColor).toEqual('rgba(0, 0, 0)');
  });

  it('should NOT save secondary color if color is underfined', () => {
    const colorService = 'colorService';
    const spy = spyOn(component[colorService], 'addColor').and.callThrough();
    component.saveColor();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should save background color in color service', () => {
    const colorVariables = 'colorVariables';
    component[colorVariables].color = 'rgba(255,255,255,1)';
    const colorService = 'colorService';
    const rendererConst = 'renderer';
    component[rendererConst] = renderer;
    component.backgroundColorClicked();
    component.saveColor();
    expect(component[colorService].backgroundColor).toEqual('rgba(255,255,255,1)');
  });

  it('should NOT add background color if color is underfined', () => {
    const colorService = 'colorService';
    const rendererConst = 'renderer';
    component[rendererConst] = renderer;
    const spy = spyOn(component[colorService], 'addColor').and.callThrough();
    component.saveColor();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should switch primary and secondary color in color service', () => {
    const colorService = 'colorService';
    component[colorService].primaryColor = 'rgb(255, 0, 0)';
    component.primaryColorClicked();
    component.saveColor();
    component[colorService].secondaryColor = 'rgb(0, 255, 0)';
    component.secondaryColorClicked();
    component.saveColor();
    component.switchColors();
    expect(component[colorService].primaryColor).toEqual('rgb(0, 255, 0)');
  });

  it('should set component color to primary color if primary color box clicked', () => {
    const colorService = 'colorService';
    const colorVariables = 'colorVariables';
    component[colorService].primaryColor = 'primary';
    component.primaryColorClicked();
    expect(component[colorVariables].color).toEqual('primary');
  });

  it('should set component color to secondary color if secondary color box left clicked', () => {
    const colorService = 'colorService';
    const colorVariables = 'colorVariables';
    component[colorService].secondaryColor = 'secondary';
    component.secondaryColorClicked();
    expect(component[colorVariables].color).toEqual('secondary');
  });

  it('should save color to primary color if valid dot is left clicked in color hisotry', () => {
      const spy = spyOn(component, 'saveColor').and.callThrough();
      const mouseEvent = new MouseEvent('click' , {button: 0});
      const colorVariables = 'colorVariables';
      component[colorVariables].color = 'color';
      const colorService = 'colorService';
      component[colorService].queue.add('color');
      component.saveColor();
      component.colorClickedInHistory(mouseEvent, 0);
      expect(spy).toHaveBeenCalled();
  });

  it('should NOT save color to primary color if INVALID dot is left clicked in color hisotry', () => {
    const spy = spyOn(component, 'saveColor').and.callThrough();
    const mouseEvent = new MouseEvent('click');
    const colorService = 'colorService';
    component[colorService].queue.add('color');
    component.colorClickedInHistory(mouseEvent, 0);
    expect(spy).toHaveBeenCalledTimes(1);
});

  it('should  NOT save color to primary color if valid dot is Right clicked in color hisotry', () => {
    const spy = spyOn(component, 'saveColor').and.callThrough();
    const mouseEvent = new MouseEvent('click', {button: 2});
    const colorVariables = 'colorVariables';
    component[colorVariables].color = 'color';
    const colorService = 'colorService';
    component[colorService].queue.add('color');
    component.saveColor();
    component.colorClickedInHistory(mouseEvent, 0);
    expect(spy).toHaveBeenCalledTimes(1);
});

  it('should  NOT save color to primary color if valid dot is Right clicked in color hisotry', () => {
  const spy = spyOn(component, 'saveColor').and.callThrough();
  const mouseEvent = new MouseEvent('click', {button: 2});
  const colorVariables = 'colorVariables';
  component[colorVariables].color = 'color';
  component.saveColor();
  component.colorClickedInHistory(mouseEvent, 0);
  expect(spy).toHaveBeenCalledTimes(1);
});

  it('should save color to secondairy color if valid dot is Rightclicked in color hisotry', () => {
    const spy = spyOn(component, 'saveColor').and.callThrough();
    const mouseEvent = new MouseEvent('click', {button: 2});
    const colorVariables = 'colorVariables';
    component[colorVariables].color = 'color';
    const colorService = 'colorService';
    component[colorService].queue.add('color');
    component.saveColor();
    component.colorRightClickedInHistory(mouseEvent, 0);
    expect(spy).toHaveBeenCalled();
});

  it('should save color to secondairy color if valid dot is Rightclicked in color hisotry', () => {
  const spy = spyOn(component, 'saveColor').and.callThrough();
  const mouseEvent = new MouseEvent('click');
  const colorVariables = 'colorVariables';
  component[colorVariables].color = 'color';
  const colorService = 'colorService';
  component[colorService].queue.add('color');
  component.saveColor();
  component.colorRightClickedInHistory(mouseEvent, 0);
  expect(spy).toHaveBeenCalled();
});

  it('should save color to secondairy color if valid dot is Rightclicked in color hisotry', () => {
  const spy = spyOn(component, 'saveColor').and.callThrough();
  const mouseEvent = new MouseEvent('click', {button: 2});
  const colorVariables = 'colorVariables';
  component[colorVariables].color = 'color';
  component.saveColor();
  component.colorRightClickedInHistory(mouseEvent, 0);
  expect(spy).toHaveBeenCalled();
});

  it('should NOT save color to secondairy color if valid dot is Left clicked in color hisotry', () => {
    const spy = spyOn(component, 'saveColor').and.callThrough();
    const mouseEvent = new MouseEvent('click');
    const colorVariables = 'colorVariables';
    component[colorVariables].color = 'color';
    component.saveColor();
    component.colorRightClickedInHistory(mouseEvent, 0);
    expect(spy).toHaveBeenCalledTimes(1);
});

  it('should NOT save color to secondairy color if INVALID dot is Rightclicked in color hisotry', () => {
    const spy = spyOn(component, 'saveColor').and.callThrough();
    const mouseEvent = new MouseEvent('click', {button: 2});
    component.colorRightClickedInHistory(mouseEvent, 0);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should update attribute transparencyChanged if transparency slider is used', () => {
    const colorVariables = 'colorVariables';
    component[colorVariables].transparencyChanged = false;
    component[colorVariables].color = 'rgba(0, 0, 0, 1)';
    const sliderEvent = new MatSliderChange();
    const ninty = 90;
    sliderEvent.value = ninty;
    component.updateSliderValue(sliderEvent);
    expect(component[colorVariables].transparencyChanged).toEqual(true);

  });

  it('should NOT update color if no color is selected and slider value is changed', () => {
    const colorVariables = 'colorVariables';
    component[colorVariables].transparencyChanged = false;
    const sliderEvent = new MatSliderChange();
    const ninty = 90;
    sliderEvent.value = ninty;
    component.updateSliderValue(sliderEvent);
    expect(component[colorVariables].color).toEqual('');
  });

  it('should NOT update color if slider value is null', () => {
    const colorVariables = 'colorVariables';
    component[colorVariables].transparencyChanged = false;
    const sliderEvent = new MatSliderChange();
    component[colorVariables].color = 'rgba(0, 0, 0,1)';
    component.updateSliderValue(sliderEvent);
    expect(component[colorVariables].color).toEqual('rgba(0, 0, 0,1)');
  });

  it('should validate a valid color input from user in hexa', () => {
      const colorVariables = 'colorVariables';
      const sendInput = async (text: string) => {
        valR.value = text;
        valG.value = text;
        valB.value = text;
        dispatchEvent(new Event('input'));
        fixture.detectChanges();
        return fixture.whenStable();
      };

      const valR = fixture.debugElement.query(By.css('#valRHex')).nativeElement;
      const valG = fixture.debugElement.query(By.css('#valGHex')).nativeElement;
      const valB = fixture.debugElement.query(By.css('#valBHex')).nativeElement;
      sendInput('ff');
      component.validateColorEntered();
      expect(component[colorVariables].color).toEqual('rgba(255,255,255,1)');
  });

  it('should alert user if color input is invalid', () => {
    const sendInput = async (text: string) => {
      valR.nativeElement.value = text;
      valG.nativeElement.value = text;
      valB.nativeElement.value = text;
      dispatchEvent(new Event('input'));
      fixture.detectChanges();
      return fixture.whenStable();
    };
    const valR = fixture.debugElement.query(By.css('#valRHex'));
    const valG = fixture.debugElement.query(By.css('#valGHex'));
    const valB = fixture.debugElement.query(By.css('#valBHex'));

    sendInput('XX');
    const spy = spyOn(window, 'alert').and.callThrough();
    component.validateColorEntered();
    expect(spy).toHaveBeenCalledWith("La valeur d'entrée devrait entre 0 et FF en hexa");
  });
});

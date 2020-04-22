import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import {MockMatSliderChange} from 'src/app/classes/mat-slider-change';
import { TextService } from 'src/app/services/text/text.service';
import { TextTAPComponent } from './text-tap.component';

describe('TextTAPComponent', () => {
  let component: TextTAPComponent;
  let fixture: ComponentFixture<TextTAPComponent>;
  let textService: TextService;
  let styleSelection: DebugElement;
  let alignSelection: DebugElement;
  let fontSelection: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}, TextService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTAPComponent);
    component = fixture.componentInstance;
    textService = TestBed.get(TextService);
    fixture.detectChanges();
    styleSelection = fixture.debugElement.query(By.css('.styleGroup'));
    alignSelection = fixture.debugElement.query(By.css('.alignGroup'));
    fontSelection = fixture.debugElement.query(By.css('.fontFam'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set stroke width to default (10)', () => {
    const event = new MockMatSliderChange();
    event.value = null;
    const textParamsStr = 'textParams';
    component.updateFontSize(event);
    const TEN = 10;
    expect(textService[textParamsStr].fontWeight).toEqual(TEN);

  });

  it('should set stroke width to 20', () => {
    const event = new MockMatSliderChange();
    const wantedSize = 20;
    event.value = wantedSize;
    const textParamsStr = 'textParams';
    component.updateFontSize(event);

    expect(textService[textParamsStr].fontWeight).toEqual(wantedSize);

  });

  it('Should change style to bold', () => {
    const textParamsStr = 'textParams';
    textService[textParamsStr].fontStyle = 'normal';
    styleSelection.triggerEventHandler('change', {value: 'bold'});

    expect( textService[textParamsStr].fontStyle).toEqual('bold');
  });

  it('Should change style to italic', () => {
    const textParamsStr = 'textParams';
    textService[textParamsStr].fontStyle = 'normal';
    styleSelection.triggerEventHandler('change', {value: 'italic'});

    expect( textService[textParamsStr].fontStyle).toEqual('italic');
  });

  it('Should change to middle', () => {
    const textParamsStr = 'textParams';
    textService[textParamsStr].align = 'left';
    alignSelection.triggerEventHandler('change', {value: 'middle'});
    expect( textService[textParamsStr].align).toEqual('middle');
  });

  it('Should change to Arial', () => {
    const textParamsStr = 'textParams';
    textService[textParamsStr].fontFamily = 'Times New Roman';
    fontSelection.triggerEventHandler('change', {value: 'Arial'});
    expect( textService[textParamsStr].fontFamily).toEqual('Times New Roman');
  });

  it('Should change value of font', () => {
    const textParamsStr = 'textParams';
    const fontFamily = 'Times New Roman';
    spyOn(textService, 'updateFF');
    component.updateFontFamily(fontFamily);
    expect( textService[textParamsStr].fontFamily).toEqual('Times New Roman');
  });

});

import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatRadioChange} from '@angular/material';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import {MockMatSliderChange} from 'src/app/classes/mat-slider-change';
import { LineService } from 'src/app/services/line/line.service';
import { LineTAPComponent } from './line-tap.component';

class MockMatRadioChange extends MatRadioChange {
  value: string;
}

describe('LineTAPComponent', () => {
  let component: LineTAPComponent;
  let fixture: ComponentFixture<LineTAPComponent>;
  let lineService: LineService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}, LineService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineTAPComponent);
    component = fixture.componentInstance;
    lineService = TestBed.get(LineService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set stroke width to 1', () => {
    const event = new MockMatSliderChange();
    event.value = null;
    component.updateSliderValueLine(event);
    const lineParams = 'lineParams';

    expect(lineService[lineParams].strokeWidth).toEqual(1);
  });

  it('should set stroke width to events value', () => {
    const event = new MockMatSliderChange();
    event.value = 2;
    component.updateSliderValueLine(event);
    const lineParams = 'lineParams';

    expect(lineService[lineParams].strokeWidth).toEqual(event.value);
  });

  it('should set the connector type to event value', () => {
    const radioButtons = fixture.debugElement.queryAll(By.css('mat-radio-button'));
    const radioButton = radioButtons[0].nativeElement;
    const event = new MockMatRadioChange(radioButton, 'jonction');
    const lineConn = 'lineConn';

    component.updateConnectorsType(event);

    expect(lineService[lineConn].connectorType).toEqual(event.value);
  });

  it('should not set the connector type to null', () => {
    const radioButtons = fixture.debugElement.queryAll(By.css('mat-radio-button'));
    const radioButton = radioButtons[1].nativeElement;
    const event = new MockMatRadioChange(radioButton, null);
    const lineConn = 'lineConn';

    lineService[lineConn].connectorType = 'aucune';
    component.updateConnectorsType(event);
    fixture.detectChanges();

    expect(lineService[lineConn].connectorType).toBe('aucune');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set connectior wiehgt to 1', () => {
    const event = new MockMatSliderChange();
    const lineConn = 'lineConn';
    event.value = null;
    component.updateSliderValueConnectors(event);

    expect(lineService[lineConn].connectorWeight).toEqual(1);
  });

  it('should set the connectior weight to event value', () => {
    const event = new MockMatSliderChange();
    const lineConn = 'lineConn';
    event.value = 2;
    component.updateSliderValueConnectors(event);

    expect(lineService[lineConn].connectorWeight).toEqual(event.value);
  });

});

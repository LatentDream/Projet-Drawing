import {APP_BASE_HREF} from '@angular/common';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { ShapeService } from 'src/app/services/shape/shape.service';
import { ShapeTAPComponent } from './shape-tap.component';

describe('ShapeTAPComponent', () => {
  let component: ShapeTAPComponent;
  let fixture: ComponentFixture<ShapeTAPComponent>;
  let mockCEDS: ClickEventDispatcherService;
  let toolSelectionButton: DebugElement;
  let slider: DebugElement;
  let style: DebugElement;
  let mockShapeService: ShapeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeTAPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockCEDS = fixture.debugElement.injector.get(ClickEventDispatcherService);
    mockShapeService = fixture.debugElement.injector.get(ShapeService);
    toolSelectionButton = fixture.debugElement.query(By.css('.attButtonGroupContainerTop'));
    slider = fixture.debugElement.query(By.css('.strokeSlider'));
    style = fixture.debugElement.query(By.css('.shapeStyle'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should not change the tools', () => {
    const spy = spyOn(mockCEDS, 'setCurrentTool').and.callThrough();
    toolSelectionButton.triggerEventHandler('change', {value: 'penguins of madagascar'});

    expect(spy).toHaveBeenCalled();
  });

  it('Should change the tools to rectangle', () => {
    const spy = spyOn(mockCEDS, 'setCurrentTool').and.callThrough();
    toolSelectionButton.triggerEventHandler('change', {value: 'rectangle'});

    expect(spy).toHaveBeenCalled();
  });

  it('Should change the tools', () => {
    const spy = spyOn(mockCEDS, 'setCurrentTool').and.callThrough();
    toolSelectionButton.triggerEventHandler('change', {value: null });

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('Should change the contour to the default value : 10', () => {
    mockShapeService.strokeWidth = 0;
    slider.triggerEventHandler('change', {value: null });
    const  ten = 10;
    expect(mockShapeService.strokeWidth).toEqual(ten);
  });

  it('Should change the contour to the event value', () => {
    mockShapeService.strokeWidth = 0;
    slider.triggerEventHandler('change', {value: 1 });

    expect(mockShapeService.strokeWidth).toEqual(1);
  });

  it('Should change the style of the shape to the event value', () => {
    mockShapeService.shapeType = '';
    style.triggerEventHandler('change', {value: 'contour' });

    expect(mockShapeService.shapeType).toEqual('contour');
  });

  it('Should not change the style', () => {
    mockShapeService.shapeType = '';
    style.triggerEventHandler('change', {value: null });

    expect(mockShapeService.shapeType).toEqual('');
  });

  it('Should change the number of sides to the event value', () => {
    component.selectedSide = '3';
    component.updateNumberSide();
    const three = 3;
    expect(mockShapeService.nbSides).toEqual(three);
  });

});

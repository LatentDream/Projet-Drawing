import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColorSliderComponent } from './color-slider.component';

describe('ColorSliderComponent', () => {
  let component = new ColorSliderComponent();
  let fixture: ComponentFixture<ColorSliderComponent>;
  const x = 1;
  const y = 1;
  const ten = 10;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('canvas'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('canvas created', () => {
    expect(component.canvas).toBeTruthy();
  });

  it('should get right color at position', () => {
    const color = component.getColorAtPosition(x, y);
    expect(color).toEqual('rgba(255,12,0,1)');
  });

  it('should select color on mouse down', () => {
    const mouseDown = 'mouseDown';
    debugElement.triggerEventHandler('mousedown', { value: ''});
    expect(component[mouseDown]).toEqual(true);
  });

  it('should call draw when clicked onMouseMove()',  () => {
    const spy = spyOn(component, 'draw').and.callThrough();
    const mouseDown = 'mouseDown';
    component[mouseDown] = true;
    debugElement.triggerEventHandler('mousemove', {mouseDown: 'true'});
    expect(spy).toHaveBeenCalled();
  });

  it('should set mouseDown to false onMouseUp()', () => {
    const mouseDown = 'mouseDown';
    const mouseEvent = new MouseEvent('mouseup');
    component[mouseDown] = true;
    component.onMouseUp(mouseEvent);
    expect(component[mouseDown]).toMatch('false');
  });

  it('should emit color through event handler after emitColor() is called', () => {
    spyOn(component.color, 'emit');
    component.emitColor(ten, ten);
    expect(component.color.emit).toHaveBeenCalled();
  });

  it('should create rectangle on canvas when clicked', () => {
    const selectedWidth = 'selectedWidth';
    component[selectedWidth] = ten;
    const ctx = 'ctx';
    const spy = spyOn(component[ctx], 'rect').and.callThrough();
    component.draw();
    expect(spy).toHaveBeenCalled();
  });

  it('should not create rectangle if canvas not initialise', () => {
    component.canvas = fixture.debugElement.query(By.css('.DoesExist'));
    const selectedWidth = 'selectedWidth';
    component[selectedWidth] = ten;
    const ctx = 'ctx';
    const spy = spyOn(component[ctx], 'rect').and.callThrough();
    component.draw();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should do nothing if attriubut mouseDown false on mouseMove()', () => {
    const mouseDown = 'mouseDown';
    component[mouseDown] = false;
    const spy = spyOn(component, 'draw').and.callThrough();
    debugElement.triggerEventHandler('mousemove', {mouseDown: 'true'});
    expect(spy).toHaveBeenCalledTimes(0);
  });

});

import { DebugElement, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let canvas: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    canvas = fixture.debugElement.query(By.css('.color-palette'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create cirlce on on if clicked', () => {
    component.selectedPosition = { x: 10, y: 10 };
    const ctx = 'ctx';
    const spy = spyOn(component[ctx], 'arc').and.callThrough();
    component.draw();
    expect(spy).toHaveBeenCalled();
  });

  it('should do nothing since canvas is not initialise', () => {
    component.canvas = fixture.debugElement.query(By.css('.DoesExist'));
    component.selectedPosition = { x: 10, y: 10};
    const ctx = 'ctx';
    const spy = spyOn(component[ctx], 'arc').and.callThrough();
    component.draw();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should do nothing if not clicked onMouseMove()', () => {
    const spy = spyOn(component, 'draw').and.callThrough();
    const mouseDown = 'mouseDown';
    component[mouseDown] = false;
    canvas.triggerEventHandler('mousemove', {mouseDown: 'true'});
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should set mouseDown to false onMouseUp()', () => {
    const mouseDown = 'mouseDown';
    const mouseEvent = new MouseEvent('mouseup');
    component[mouseDown] = true;
    component.onMouseUp(mouseEvent);
    expect(component[mouseDown]).toMatch('false');
  });

  it('should call draw when clicked onMouseMove()',  () => {
    const spy = spyOn(component, 'draw').and.callThrough();
    const mouseDown = 'mouseDown';
    component[mouseDown] = true;
    canvas.triggerEventHandler('mousemove', {mouseDown: 'true'});
    expect(spy).toHaveBeenCalled();
  });

  it('should call draw onMouseDown()', () => {
    const spy = spyOn(component, 'draw').and.callThrough();
    canvas.triggerEventHandler('mousedown', {mouseDown: 'true'});
    expect(spy).toHaveBeenCalled();
  });

  it('should emit color through event handler after emitColor() is called', () => {
    spyOn(component.color, 'emit');
    const ten = 10;
    component.emitColor( ten, ten );
    expect(component.color.emit).toHaveBeenCalled();

  });

  it('should call draw if hue is part of changes', () => {
    const hue = 'hue';
    component.selectedPosition = {x: 10, y: 10};
    component[hue] = 'invalidHue';
    const spy = spyOn(component, 'draw').and.callThrough();
    component.ngOnChanges({hue: new SimpleChange(null, 'validHue', true)});
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should NOT call draw if hue is not part of changes', () => {
    const hue = 'hue';
    component.selectedPosition = {x: 10, y: 10};
    component[hue] = 'invalidHue';
    const spy = spyOn(component, 'draw').and.callThrough();
    const change = new SimpleChange(null, 'invalidHue', true);
    component.ngOnChanges({notHue: change});
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });

});

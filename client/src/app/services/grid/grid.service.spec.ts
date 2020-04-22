import { TestBed } from '@angular/core/testing';

import { MatSliderChange } from '@angular/material';
import { GRID } from '../enum';
import { GridService } from './grid.service';

describe('GridService', () => {
  let service: GridService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });

    service = TestBed.get(GridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.gridIsActive).toBe(false);
    expect(service.scale).toBe(GRID.BASE_SCALE);
    expect(service.path).toBe(GRID.BASE_PATH);
    expect(service.opacity).toBe(GRID.BASE_OPACITY);
  });

  it('should toggle gridIsActive', () => {
    service.gridIsActive = false;
    service.toggleGrid();
    expect(service.gridIsActive).toBe(true);
  });

  it('should change scale and path on slider change', () => {
    const mockEvent = new MatSliderChange();
    const mockValue = 10;
    mockEvent.value = mockValue;
    service.scaleChange(mockEvent);

    expect(service.scale).toBe(mockValue);
    expect(service.path).toBe('M 10 0 L 0 0 0 10');
  });

  it('should NOT change scale and path on slider change', () => {
    const scale = 20;
    service.scale = scale;
    service.path = 'M 20 0 L 0 0 0 20';
    const mockEvent = new MatSliderChange();
    mockEvent.value = null;
    service.scaleChange(mockEvent);

    expect(service.scale).toBe(scale);
    expect(service.path).toBe('M 20 0 L 0 0 0 20');
  });

  it('should change opacity on slider change', () => {
    const mockEvent = new MatSliderChange();
    const value = 10;
    mockEvent.value = value;
    service.opacityChange(mockEvent);

    expect(service.opacity).toBe(value);
  });

  it('should change opacity on slider change', () => {
    const value = 10;
    service.opacity	= value;
    const mockEvent = new MatSliderChange();
    mockEvent.value = null;
    service.opacityChange(mockEvent);

    expect(service.opacity).toBe(value);
  });

  it('should change scale and path increment', () => {
    const scale = 10;
    service.scale = scale;
    service.increment();
    const scaleExpected = 15;
    expect(service.scale).toBe(scaleExpected);
    expect(service.path).toBe('M 15 0 L 0 0 0 15');
  });

  it('should NOT change scale and path increment', () => {
    service.scale = GRID.MAX_SCALE;
    service.path = 'M ' + GRID.MAX_SCALE + ' 0 L 0 0 0 ' + GRID.MAX_SCALE;
    service.increment();

    expect(service.scale).toBe(GRID.MAX_SCALE);
    expect(service.path).toBe('M ' + GRID.MAX_SCALE + ' 0 L 0 0 0 ' + GRID.MAX_SCALE);
  });

  it('should change scale and path decrement', () => {
    const scaleValue = 100;
    service.scale = scaleValue;
    service.decrement();
    const expectedScale = 95;
    expect(service.scale).toBe(expectedScale);
    expect(service.path).toBe('M 95 0 L 0 0 0 95');
  });

  it('should NOT change scale and path decrement', () => {
    service.scale = GRID.MIN_SCALE;
    service.path = 'M ' + GRID.MIN_SCALE + ' 0 L 0 0 0 ' + GRID.MIN_SCALE;
    service.decrement();

    expect(service.scale).toBe(GRID.MIN_SCALE);
    expect(service.path).toBe('M ' + GRID.MIN_SCALE + ' 0 L 0 0 0 ' + GRID.MIN_SCALE);
  });
});

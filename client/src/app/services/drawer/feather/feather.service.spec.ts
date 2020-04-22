import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FEATHER } from '../../enum';
import { FeatherService } from './feather.service';

describe('FeatherService', () => {
  let service: FeatherService;
  let renderer: Renderer2;
  beforeEach(() => {
    renderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
    TestBed.configureTestingModule({
      providers: [FeatherService, Renderer2]
    });
    service = TestBed.get(FeatherService);
  }
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a renderer', () => {
    const rendererStr = 'renderer';
    expect(service[rendererStr]).toBeDefined();
  });

  it('should set parent to parentNode of target', () => {
    const rendererStr = 'renderer';
    const parent = 'parent';
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockParent: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    service[rendererStr] = renderer;
    Object.defineProperty(event, 'target', { get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });

    service.setParent(event);
    expect(service[parent]).toBe(mockParent);
  });

  it('should set parent to target', () => {
    const rendererStr = 'renderer';
    const parent = 'parent';
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockTarget: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    Object.defineProperty(mockTarget, 'nodeName', { value: 'svg' });
    service[rendererStr] = renderer;
    Object.defineProperty(event, 'target', { value: mockTarget });

    service.setParent(event);
    expect(service[parent]).toBe(mockTarget);
  });

  it('should set parent to target', () => {
    const rendererStr = 'renderer';
    const parent = 'parent';
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockTarget: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    Object.defineProperty(mockTarget, 'nodeName', { value: 'svg' });
    service[rendererStr] = renderer;
    Object.defineProperty(event, 'target', { value: mockTarget });

    service.setParent(event);
    expect(service[parent]).toBe(mockTarget);
  });

  it('should create a group element', () => {
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    const rendererStr = 'renderer';
    const strokeWidth = 'strokeWidth';
    spyOnProperty(event, 'target').and.returnValue(parent);

    service[rendererStr] = renderer;
    const strokeWidth5 = 5;
    service[strokeWidth] = strokeWidth5;
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.mouseDown(event, 1);

    expect(renderer.createElement).toHaveBeenCalledWith(FEATHER.ELEMENT, FEATHER.LINK);
    expect(service.featherAngle).toEqual([ strokeWidth5 , 0 ]);
  });

  it('should do nothing on mouseMove', () => {
    const event = new MouseEvent('mousedown');
    const spy = spyOn(service, 'nextPoint');
    service.currentlyDrawing = false;
    service.mouseMove(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call nextPoint', () => {
    const event = new MouseEvent('mousedown');
    const spy = spyOn(service, 'nextPoint');
    service.currentlyDrawing = true;
    service.mouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should do nothing on mouseUp', () => {
    const event = new MouseEvent('mousedown');
    service.currentlyDrawing = false;
    service.mouseUp(event);
    expect(service.currentlyDrawing).toEqual(false);
  });

  it('should reset points and put currently drawing at false', () => {
    const event = new MouseEvent('mousedown');
    service.currentlyDrawing = true;
    service.mouseUp(event);
    expect(service.currentlyDrawing).toEqual(false);
  });

  it('should do nothing on mouseLeave', () => {
    service.currentlyDrawing = false;
    service.mouseLeave();
    expect(service.currentlyDrawing).toEqual(false);
  });

  it('should reset point and put currentlyDrawing at false nothing on mouseLeave', () => {
    service.currentlyDrawing = true;
    service.mouseLeave();
    expect(service.currentlyDrawing).toEqual(false);
  });

  it('should create a polygon', () => {
    const rendererStr = 'renderer';
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    const mockNextPoint = [mockOffsetX, mockOffsetY];
    service.points.push([mockOffsetX, mockOffsetY]);
    const pointsX = 521;
    const pointsY = 78;
    const nbPoint = 3;
    service.points[0] = [pointsX, pointsY];
    service.points[1] = [pointsX, pointsY];
    service.points[2] = [pointsX, pointsY];
    service.points[nbPoint] = [pointsX + 1, pointsY - 1];
    service.points[nbPoint + 1] = [pointsX + 1, pointsY - 1];
    service.points[nbPoint + 2] = [pointsX + 2, pointsY - 1];
    service.featherAngle = [1, 0];
    const spy = spyOn(service[rendererStr], 'appendChild');
    const spy2 = spyOn(service[rendererStr], 'setAttribute');
    service.nextPoint(mockNextPoint);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledTimes(2);
  });

});

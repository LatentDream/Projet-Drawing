import { TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { ToolPropAero } from 'src/app/classes/tool-prop-aero';
import { CIRCLE, SPRAY } from '../enum';
import { SprayService } from './spray.service';

enum ATT {
  RENDERER = 'renderer',
  CURRENTLY_DRAWING = 'currentlyDrawing',
  PROP = 'prop',
  EMISSION_PER_SEC = 'emissionPerSec',
  PARENT = 'parent',
  DOT = 'dot',
  COLOR_SERVICE = 'colorService'
}
describe('SprayService', () => {
  let service: SprayService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2]
    });
    service = TestBed.get(SprayService);
    service[ATT.RENDERER] = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Constructor
  it('should initialize attributes', () => {
    expect(service[ATT.CURRENTLY_DRAWING]).toBe(false);
    expect(service[ATT.PROP]).toBeTruthy();
    expect(service[ATT.RENDERER]).toBeTruthy();
    expect(service[ATT.EMISSION_PER_SEC]).toBe(SPRAY.MAX_EPS);
  });

  // MouseDown
  it('should call local methods', () => {
    const spySetParent = spyOn(service, 'setParent').and.returnValue();
    const spySetDotParams = spyOn(service, 'setDotParams').and.returnValue();
    const spyStartRendering = spyOn(service, 'startRendering').and.returnValue();
    const event = new MouseEvent('mousedown', {});
    service.mouseDown(event, 1);
    expect(spySetParent).toHaveBeenCalledWith(event);
    expect(spySetDotParams).toHaveBeenCalled();
    expect(spyStartRendering).toHaveBeenCalled();
  });

  it('should modify prop attributes on mouseDown', () => {
    const propX = 10;
    const propY = 20;
    spyOn(service, 'setParent').and.returnValue();
    spyOn(service, 'setDotParams').and.returnValue();
    spyOn(service, 'startRendering').and.returnValue();
    service[ATT.RENDERER].createElement =
      (el: string, link: string) => {
        expect(el).toEqual(SPRAY.ELEMENT);
        expect(link).toEqual(SPRAY.LINK);
        return document.createElement(SPRAY.ELEMENT);
      };
    const event = new MouseEvent('mousedown', {});
    spyOnProperty(event, 'offsetX').and.returnValue(propX);
    spyOnProperty(event, 'offsetY').and.returnValue(propY);
    service[ATT.PROP] = new ToolPropAero();
    service.mouseDown(event, 1);
    expect(service[ATT.PROP].element).toBeTruthy();
    expect(service[ATT.PROP].x).toEqual(propX);
    expect(service[ATT.PROP].y).toEqual(propY);
  });

  it('should update prop x and y on mouseMove', () => {
    const propX = 10;
    const propY = 20;
    service[ATT.CURRENTLY_DRAWING] = true;
    const event = new MouseEvent('mousemove', {});
    service[ATT.PROP].x = 0;
    service[ATT.PROP].y = 0;
    spyOnProperty(event, 'offsetX').and.returnValue(propX);
    spyOnProperty(event, 'offsetY').and.returnValue(propY);
    service[ATT.PROP] = new ToolPropAero();
    service.mouseMove(event);
    expect(service[ATT.PROP].x).toEqual(propX);
    expect(service[ATT.PROP].y).toEqual(propY);
  });

  it('should NOT update prop x and y on mouseMove', () => {
    const propX = 10;
    const propY = 20;
    service[ATT.CURRENTLY_DRAWING] = false;
    const event = new MouseEvent('mousemove', {});
    service[ATT.PROP].x = 0;
    service[ATT.PROP].y = 0;
    spyOnProperty(event, 'offsetX').and.returnValue(propX);
    spyOnProperty(event, 'offsetY').and.returnValue(propY);
    service[ATT.PROP] = new ToolPropAero();
    service.mouseMove(event);
    expect(service[ATT.PROP].x).not.toEqual(propX);
    expect(service[ATT.PROP].y).not.toEqual(propY);
  });

  it('should set currentlyDrawing to false on mouseUp', () => {
    service[ATT.CURRENTLY_DRAWING] = true;
    service.mouseUp();
    expect(service[ATT.CURRENTLY_DRAWING]).toBe(false);
  });

  it('should set currentlyDrawing to false', () => {
    service[ATT.CURRENTLY_DRAWING] = true;
    service.mouseLeave();
    expect(service[ATT.CURRENTLY_DRAWING]).toBe(false);
  });

  it('should set parent to parentNode of target', () => {
    let mockSVG = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockSVG.setAttribute.and.callThrough();
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockParent: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    mockSVG = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    service[ATT.RENDERER] = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
    Object.defineProperty(event, 'target', { get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });

    service.setParent(event);
    expect(service[ATT.PARENT]).toBe(mockParent);
  });

  it('should set parent to target', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockTarget: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    Object.defineProperty(mockTarget, 'nodeName', { value: 'svg' });
    service[ATT.RENDERER] = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
    Object.defineProperty(event, 'target', { value: mockTarget });

    service.setParent(event);
    expect(service[ATT.PARENT]).toBe(mockTarget);
  });

  it('should set dot attribute and call setAttribute', () => {
    service[ATT.RENDERER].createElement =
      (el: string, link: string) => {
        expect(el).toEqual(CIRCLE.ELEMENT);
        expect(link).toEqual(CIRCLE.LINK);
        return document.createElement(CIRCLE.ELEMENT);
      };
    service.setDotParams();
    expect(service[ATT.DOT]).toBeTruthy();
    expect(service[ATT.RENDERER].setAttribute).toHaveBeenCalledWith(
      undefined, CIRCLE.FILL, service[ATT.COLOR_SERVICE].primaryColor
      );
  });

  it('should NOT render on startRendering', () => {
    service[ATT.CURRENTLY_DRAWING] = false;
    const spy = spyOn(global, 'setTimeout');
    service.startRendering();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should render spray dots', () => {
    const strokeWidth = 5;
    const emisionSec = 100;
    service[ATT.CURRENTLY_DRAWING] = true;
    service.strokeWidth = strokeWidth;
    service.emissionPerSec = emisionSec;
    const tempDot = document.createElement('circle');
    service[ATT.DOT] = tempDot;

    const spyTimeout = spyOn(global, 'setTimeout').and.returnValues();
    const spyRandom = spyOn(service, 'random').and.callThrough();
    const spyClone = spyOn(service[ATT.DOT], 'cloneNode').and.callThrough();

    service.startRendering();
    service.mouseUp();

    expect(spyClone).toHaveBeenCalled();
    expect(spyTimeout).toHaveBeenCalled();
    expect(service[ATT.RENDERER].appendChild).toHaveBeenCalledWith(service[ATT.PROP].element, service[ATT.DOT]);
    expect(service[ATT.RENDERER].setAttribute).toHaveBeenCalled();
    expect(spyRandom).toHaveBeenCalled();
  });
});

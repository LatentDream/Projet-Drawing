import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RECT } from '../../enum';
import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {
  let service: RectangleService;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(RectangleService);
    renderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

  });

  it('should set rendering to true on mousedown', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    service.mouseDown(event, 1);
    const rendering = 'rendering';
    expect(service[rendering]).toEqual(true);
  });

  it('should create a rectangle (call to renderer)', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const spy = spyOn(service, 'setParent');
    service.mouseDown(event, 1);
    expect(renderer.createElement).toHaveBeenCalledWith(RECT.ELEMENT, RECT.LINK);
    expect(spy).toHaveBeenCalled();
  });

  it('should set parent to parentNode of target', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockParent: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    Object.defineProperty(event, 'target', { get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });
    service.setParent(event);
    const parent = 'parent';
    expect(service[parent]).toBe(mockParent);
  });

  it('should set parent to target', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockTarget: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    Object.defineProperty(mockTarget, 'nodeName', { value: 'svg' });
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    Object.defineProperty(event, 'target', { value: mockTarget });
    service.setParent(event);
    const parent = 'parent';
    expect(service[parent]).toBe(mockTarget);
  });

  it('should set rectangle attributes on type filled (call to renderer)', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const shapeService = 'shapeService';
    service[shapeService].shapeType = 'filled';
    const colorService = 'colorService';
    service[colorService].primaryColor = 'red';
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.mouseDown(event, 1);
    const nbTimes = 8;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
    const prop = 'prop';
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.X, '10');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.Y, '25');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.HEIGHT, '0');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.WIDTH, '0');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.STROKE_WIDTH, '0');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.FILL, 'red');

  });

  it('should set rectangle attributes on type contour (call to renderer)', () => {
    const strokeWidth = 5;
    const nbTimes = 9;
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const shapeService = 'shapeService';
    service[shapeService].shapeType = 'contour';
    service[shapeService].strokeWidth = strokeWidth;
    const colorService = 'colorService';
    service[colorService].secondaryColor = 'red';
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.mouseDown(event, 1);

    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
  });

  it('should set rectangle attributes on type contourFilled (call to renderer)', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const shapeService = 'shapeService';
    service[shapeService].shapeType = 'contourFilled';
    const strokeWidth = 5;
    service[shapeService].strokeWidth = strokeWidth;
    const colorService = 'colorService';
    service[colorService].secondaryColor = 'blue';
    service[colorService].primaryColor = 'red';
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.mouseDown(event, 1);
    const nbTimes = 9;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
  });

  it('should not set rectangle attributes on unknow values (call to renderer)', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const shapeService = 'shapeService';
    service[shapeService].shapeType = 'none';
    service.mouseDown(event, 1);
    const nbTimes = 6;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
  });

  it('should append rectangle on mousedown (call to renderer)', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    service.mouseDown(event, 1);
    expect(renderer.appendChild).toHaveBeenCalled();
  });

  it('should set rendering to false on mouseup', () => {
    const event = new MouseEvent('mouseup', {});
    service.mouseUp(event);
    const rendering = 'rendering';
    expect(service[rendering]).toEqual(false);
  });

  it('should set rendering to false on mouse leave', () => {
    service.mouseLeave();
    const rendering = 'rendering';
    expect(service[rendering]).toEqual(false);
  });

  it('should set top corner of rectangle', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;

    const mockOffsetX = 10;
    const mockOffsetY = 25;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);

    service.mouseDown(event, 1);
    const prop = 'prop';
    expect(service[prop].xTop).toEqual(mockOffsetX);
    expect(service[prop].yTop).toEqual(mockOffsetY);
  });

  it('should assign the last mouse event and not call render square', () => {
    const event = new MouseEvent('mousemove', { shiftKey: false});
    const rendering = 'rendering';
    service[rendering] = true;
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const spy = spyOn(service, 'renderSquare');
    service.mouseMove(event);
    const lastMouseEvent = 'lastMouseEvent';
    expect(service[lastMouseEvent]).toEqual(event);
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call renderSquare and not renderer', () => {
    const event = new MouseEvent('mousemove', {shiftKey: true});
    const rendering = 'rendering';
    service[rendering] = true;
    const spy = spyOn(service, 'renderSquare');
    service.mouseMove(event);
    expect(renderer.setAttribute).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should call neither rendersquare or renderer', () => {
    const event = new MouseEvent('mousemove', {shiftKey: true});
    const rendering = 'rendering';
    service[rendering] = false;
    const spy = spyOn(service, 'renderSquare');
    service.mouseMove(event);
    expect(renderer.setAttribute).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not flip prop.xTop and Offsetx when rendering a rectangle in 2nd quadrant', () => {
    const event = new MouseEvent('mousemove', {shiftKey: false});
    const mockOffsetX = 10;
    const mockOffsetY = 10;
    const rendering = 'rendering';
    service[rendering] = true;
    const prop = 'prop';
    const top = 5;
    service[prop].xTop = top;
    service[prop].yTop = top;
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;

    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const spy = spyOn(service, 'renderSquare');
    service.mouseMove(event);
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.X, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.Y, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.HEIGHT, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.WIDTH, '5');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should flip prop.xTop and Offsetx when rendering a rectangle in 4th quadrant', () => {
    const event = new MouseEvent('mousemove', {shiftKey: false});
    const mockOffsetX = 5;
    const mockOffsetY = 5;
    const rendering = 'rendering';
    service[rendering] = true;
    const prop = 'prop';
    const top = 10;
    service[prop].xTop = top;
    service[prop].yTop = top;
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;

    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const spy = spyOn(service, 'renderSquare');
    service.mouseMove(event);
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.X, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.Y, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.HEIGHT, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.WIDTH, '5');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should render a square in 4th quadrant (y is wide side)', () => {
    const event = new MouseEvent('mousemove');
    const mockOffsetX = 40;
    const mockOffsetY = 50;
    const rendering = 'rendering';
    service[rendering] = true;
    const prop = 'prop';
    const top = 10;
    service[prop].xTop = top;
    service[prop].yTop = top;
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;

    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);

    service.renderSquare(event);
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
  });

  it('should render a square in 4th quadrant (x is wide side)', () => {
    const event = new MouseEvent('mousemove');
    const mockOffsetX = 50;
    const mockOffsetY = 40;
    const rendering = 'rendering';
    service[rendering] = true;
    const prop = 'prop';
    const top = 10;
    service[prop].xTop = top;
    service[prop].yTop = top;
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;

    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);

    service.renderSquare(event);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.X, '10');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.Y, '10');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.HEIGHT, '30');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.WIDTH, '30');
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
  });

  it('should render a square in 2nd quadrant (x is wide side)', () => {
    const event = new MouseEvent('mousemove');
    const mockOffsetX = 10;
    const mockOffsetY = 10;
    const rendering = 'rendering';
    service[rendering] = true;
    const prop = 'prop';
    const xTop = 50;
    const yTop = 40;
    service[prop].xTop = xTop;
    service[prop].yTop = yTop;
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;

    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);

    service.renderSquare(event);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.X, '20');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.Y, '10');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.HEIGHT, '30');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.WIDTH, '30');
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
  });

  it('should render a square in 2nd quadrant (y is wide side)', () => {
    const event = new MouseEvent('mousemove');
    const mockOffsetX = 10;
    const mockOffsetY = 10;
    const rendering = 'rendering';
    service[rendering] = true;
    const prop = 'prop';
    const xTop = 40;
    const yTop = 50;
    service[prop].xTop = xTop;
    service[prop].yTop = yTop;
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;

    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.renderSquare(event);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.X, '10');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.Y, '20');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.HEIGHT, '30');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, RECT.WIDTH, '30');
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
  });

  it('should render a square on shiftkey down not rendering', () => {
    const rendering = 'rendering';
    service[rendering] = true;
    const spy = spyOn(service, 'renderSquare');
    service.shiftkeyDownCall();
    expect(spy).toHaveBeenCalled();
  });

  it('should not render a square on shiftkey down not renderin', () => {
    const rendering = 'rendering';
    service[rendering] = false;
    const spy = spyOn(service, 'renderSquare');
    service.shiftkeyDownCall();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should render a rectangle on shift key up', () => {
    const rendering = 'rendering';
    service[rendering] = true;
    const spy = spyOn(service, 'mouseMove');
    service.shiftkeyUpCall();
    expect(spy).toHaveBeenCalled();
  });

  it('should not render a rectangle on shift key up not rendering', () => {
    const rendering = 'rendering';
    service[rendering] = false;
    const spy = spyOn(service, 'mouseMove');
    service.shiftkeyUpCall();
    expect(spy).not.toHaveBeenCalled();
  });
// Garder les tests ensembles
// tslint:disable-next-line: max-file-line-count
});

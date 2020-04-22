import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ELLIPSE } from '../../enum';
import { EllipseService } from './ellipse.service';

describe('EllipseService', () => {
  let service: EllipseService;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(EllipseService);
    renderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

  });

  it('should set rendering to true on mousedown', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const renDerer = 'renderer';
    service[renDerer] = renderer;
    service.mouseDown(event, 1);
    const rendering = 'rendering';
    expect(service[rendering]).toEqual(true);
  });

  it('should create an ellipse (call to renderer)', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const renDerer = 'renderer';
    service[renDerer] = renderer;
    const spy = spyOn(service, 'setParent');
    service.mouseDown(event, 1);
    expect(renderer.createElement).toHaveBeenCalledWith(ELLIPSE.ELEMENT, ELLIPSE.LINK);
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

  it('should set ellipse attributes on type filled (call to renderer)', () => {
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
    const numberTimeCalled = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(numberTimeCalled);
    const prop = 'prop';

    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.STROKE_WIDTH, '0');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.FILL, 'red');

  });

  it('should set ellipse attributes on type contour (call to renderer)', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const shapeService = 'shapeService';
    service[shapeService].shapeType = 'contour';
    const strokeWidth = 5;
    service[shapeService].strokeWidth = strokeWidth;
    const colorService = 'colorService';
    service[colorService].secondaryColor = 'red';
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.mouseDown(event, 1);
    const numberTimeCalled = 5;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(numberTimeCalled);
    const prop = 'prop';

    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.STROKE_WIDTH, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.STROKE, 'red');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.FILL_OPACITY, '0');

  });

  it('should set ELLIPSE attributes on type contourFilled (call to renderer)', () => {
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
    const numberTimeCalled = 5;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(numberTimeCalled);
    const prop = 'prop';

    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.STROKE, 'blue');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.STROKE_WIDTH, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.FILL, 'red');
  });

  it('should not set ELLIPSE attributes on unknow values (call to renderer)', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const shapeService = 'shapeService';
    service[shapeService].shapeType = 'none';
    service.mouseDown(event, 1);
    expect(renderer.setAttribute).toHaveBeenCalledTimes(2);
  });

  it('should append ELLIPSE on mousedown (call to renderer)', () => {
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

  it('should set top corner of ELLIPSE', () => {
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

  it('should assign the last mouse event and not call render circle', () => {
    const event = new MouseEvent('mousemove', { shiftKey: false});
    const rendering = 'rendering';
    service[rendering] = true;
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const spy = spyOn(service, 'renderCircle');
    service.mouseMove(event);
    const lastMouseEvent = 'lastMouseEvent';
    expect(service[lastMouseEvent]).toEqual(event);
    const nbTime = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTime);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call renderCircle and not renderer', () => {
    const event = new MouseEvent('mousemove', {shiftKey: true});
    const rendering = 'rendering';
    service[rendering] = true;
    const spy = spyOn(service, 'renderCircle');
    service.mouseMove(event);
    expect(renderer.setAttribute).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should call neither renderCircle or renderer', () => {
    const event = new MouseEvent('mousemove', {shiftKey: true});
    const rendering = 'rendering';
    service[rendering] = false;
    const spy = spyOn(service, 'renderCircle');
    service.mouseMove(event);
    expect(renderer.setAttribute).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not flip prop.xTop and Offsetx when rendering an ellipse in 2nd quadrant', () => {
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
    const spy = spyOn(service, 'renderCircle');
    service.mouseMove(event);
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.CX, '7.5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.CY, '7.5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.RY, '2.5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.RX, '2.5');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should flip prop.xTop and Offsetx when rendering a ELLIPSE in 4th quadrant', () => {
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
    const spy = spyOn(service, 'renderCircle');
    service.mouseMove(event);
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.CX, '7.5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.CY, '7.5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.RY, '2.5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.RX, '2.5');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should render an ellipse in 4th quadrant (y is wide side)', () => {
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

    service.renderCircle(event);
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
  });

  it('should render an ellipse in 4th quadrant (x is wide side)', () => {
    const event = new MouseEvent('mousemove');
    const mockOffsetX = 50;
    const mockOffsetY = 40;
    const xTop = 10;
    const yTop = 10;
    const rendering = 'rendering';
    service[rendering] = true;
    const prop = 'prop';
    service[prop].xTop = xTop;
    service[prop].yTop = yTop;
    const renDerer = 'renderer';
    service[renDerer] = renderer;

    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);

    service.renderCircle(event);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.CX, '25');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.CY, '25');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.RY, '15');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.RX, '15');
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
  });

  it('should render an ellipse in 2nd quadrant (x is wide side)', () => {
    const event = new MouseEvent('mousemove');
    const mockOffsetX = 10;
    const mockOffsetY = 10;
    const xTop = 50;
    const yTop = 40;
    const rendering = 'rendering';
    service[rendering] = true;
    const prop = 'prop';
    service[prop].xTop = xTop;
    service[prop].yTop = yTop;
    const renDerer = 'renderer';
    service[renDerer] = renderer;

    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);

    service.renderCircle(event);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.CX, '35');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.CY, '25');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.RY, '15');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.RX, '15');
    const nbTimes = 4;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
  });

  it('should render a circle in 2nd quadrant (y is wide side)', () => {
    const event = new MouseEvent('mousemove');
    const mockOffsetX = 10;
    const mockOffsetY = 10;
    const xTop = 40;
    const yTop = 50;
    const numberTimeCalled = 4;
    const rendering = 'rendering';
    service[rendering] = true;
    const prop = 'prop';
    service[prop].xTop = xTop;
    service[prop].yTop = yTop;
    const renDerer = 'renderer';
    service[renDerer] = renderer;

    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.renderCircle(event);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.CX, '25');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.CY, '35');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.RY, '15');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, ELLIPSE.RX, '15');
    expect(renderer.setAttribute).toHaveBeenCalledTimes(numberTimeCalled);
  });

  it('should render a circle on shiftkey down not rendering', () => {
    const rendering = 'rendering';
    service[rendering] = true;
    const spy = spyOn(service, 'renderCircle');
    service.shiftkeyDownCall();
    expect(spy).toHaveBeenCalled();
  });

  it('should not render a circle on shiftkey down not renderin', () => {
    const rendering = 'rendering';
    service[rendering] = false;
    const spy = spyOn(service, 'renderCircle');
    service.shiftkeyDownCall();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should render an ellipse on shift key up', () => {
    const rendering = 'rendering';
    service[rendering] = true;
    const spy = spyOn(service, 'mouseMove');
    service.shiftkeyUpCall();
    expect(spy).toHaveBeenCalled();
  });

  it('should not render an ellipse on shift key up not rendering', () => {
    const rendering = 'rendering';
    service[rendering] = false;
    const spy = spyOn(service, 'mouseMove');
    service.shiftkeyUpCall();
    expect(spy).not.toHaveBeenCalled();
  });
// Garder les tests ensembles
// tslint:disable-next-line: max-file-line-count
});

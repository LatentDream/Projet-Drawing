import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PATH } from '../../enum';
import { PencilService } from './pencil.service';

describe('PencilService', () => {

  let service: PencilService;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2]
    });
    service = TestBed.get(PencilService);
    renderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a renderer', () => {
    const rendererStr = 'renderer';
    expect(service[rendererStr]).toBeDefined();
  });

  // Test SetParent()

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

  // Test mouseUp

  it('should set currentlyDrawing at false', () => {
    const currentlyDrawing = 'currentlyDrawing';
    const event = new MouseEvent('mouseup');
    const rendererStr = 'renderer';
    service[currentlyDrawing] = true;
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    service[rendererStr] = renderer;
    service.mouseUp(event);
    expect(service[currentlyDrawing]).toEqual(false);
  });

  it('should leave currentlyDrawing at false', () => {
    const currentlyDrawing = 'currentlyDrawing';
    const event = new MouseEvent('mouseup');
    const rendererStr = 'renderer';
    service[currentlyDrawing] = false;
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    service[rendererStr] = renderer;
    service.mouseUp(event);
    expect(service[currentlyDrawing]).toEqual(false);
  });

  // Test mouseLeave()

  it('should leave currentlyDrawing at false', () => {
    const currentlyDrawing = 'currentlyDrawing';
    service[currentlyDrawing] = false;
    service.mouseLeave();
    expect(service[currentlyDrawing]).toEqual(false);
  });

  it('should set currentlyDrawing at false', () => {
    const currentlyDrawing = 'currentlyDrawing';
    service[currentlyDrawing] = true;
    service.mouseLeave();
    expect(service[currentlyDrawing]).toEqual(false);
  });

  // Test mouseMove

  it('should do nothing', () => {
    const event = new MouseEvent('mousemove');
    const rendererStr = 'renderer';
    const currentlyDrawing = 'currentlyDrawing';
    service[currentlyDrawing] = false;
    const spy = spyOn(service[rendererStr], 'setAttribute');
    service.mouseMove(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should do nothing but enter in first if', () => {

    const event = new MouseEvent('mousemove');
    const currentlyDrawing = 'currentlyDrawing';
    service[currentlyDrawing] = true;
    const rendererStr = 'renderer';
    const spy = spyOn(service[rendererStr], 'setAttribute');

    const mockOffsetX = 10;
    const mockOffsetY = 25;
    const prop = 'prop';
    const lastXPosition = 9;
    const lastYPosition = 24;
    service[prop].lastXPosition = lastXPosition;
    service[prop].lastYPosition = lastYPosition;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);

    service.mouseMove(event);
    expect(spy).not.toHaveBeenCalled();

  });

  it('should set setAttribute and lastX and lastY ', () => {

    const event = new MouseEvent('mousemove');
    const currentlyDrawing = 'currentlyDrawing';
    service[currentlyDrawing] = true;

    const mockOffsetX = 10;
    const mockOffsetY = 25;
    const prop = 'prop';
    const lastXPosition = 5;
    const lastYPosition = 14;
    service[prop].lastXPosition = lastXPosition;
    service[prop].lastYPosition = lastYPosition;

    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const rendererSTR = 'renderer';
    const spy = spyOn(service[rendererSTR], 'setAttribute');

    service.mouseMove(event);
    expect(spy).toHaveBeenCalledWith(service[prop].element, PATH.D, service[prop].position);
    expect(service[prop].lastXPosition).toEqual(mockOffsetX);
    expect(service[prop].lastYPosition).toEqual(mockOffsetY);
    expect(service[prop].position).toEqual('undefined, 10 25');

  });

  // Test mouseDown

  it('should set pencil attributes', () => {
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    const rendererStr = 'renderer';
    const colorService = 'colorService';
    const strokeWidth = 'strokeWidth';
    const prop = 'prop';

    spyOnProperty(event, 'target').and.returnValue(parent);
    service[rendererStr] = renderer;
    service[colorService].primaryColor = 'red';
    const strokeWidth5 = 5;
    service[strokeWidth] = strokeWidth5;
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.mouseDown(event, 1);
    const nbTimes = 8;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, PATH.D, 'M10,25');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, PATH.FILL, 'none');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, PATH.STROKE, 'red');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, PATH.STROKE_WIDTH, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, PATH.STROKE_LINECAP, 'round');

  });

  it('should create a pencil', () => {
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    const rendererStr = 'renderer';
    const colorService = 'colorService';
    const strokeWidth = 'strokeWidth';
    spyOnProperty(event, 'target').and.returnValue(parent);

    service[rendererStr] = renderer;
    service[colorService].primaryColor = 'red';
    const strokeWidth5 = 5;
    service[strokeWidth] = strokeWidth5;
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.mouseDown(event, 1);

    expect(renderer.createElement).toHaveBeenCalledWith(PATH.ELEMENT, PATH.LINK);

  });

  it('should appendChild with right parameters', () => {
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    const rendererStr = 'renderer';
    const colorService = 'colorService';
    const strokeWidth = 'strokeWidth';
    const parentStr = 'parent';
    const prop = 'prop';

    spyOnProperty(event, 'target').and.returnValue(parent);

    service[rendererStr] = renderer;
    service[colorService].primaryColor = 'red';
    const strokeWidth5 = 5;
    service[strokeWidth] = strokeWidth5;
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.mouseDown(event, 1);

    expect(renderer.appendChild).toHaveBeenCalledWith(service[parentStr], service[prop].element);

  });

});

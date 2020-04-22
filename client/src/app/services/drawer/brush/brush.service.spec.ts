import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PATH } from '../../enum';
import { BrushService } from './brush.service';

describe('BrushService', () => {
  let brushService: BrushService;
  let mockRenderer: Renderer2;
  beforeEach(() => {
    mockRenderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);

    TestBed.configureTestingModule({
      providers: [BrushService, Renderer2]
    });
    brushService = TestBed.get(BrushService);
  }
  );

  it('should be created', () => {
    expect(brushService).toBeTruthy();
  });

  it('should create a renderer', () => {
    const renderer = 'renderer';
    expect(brushService[renderer]).toBeDefined();
  });

  // mouseDown

  it('should appendChild with right parameters', () => {
    const mockStrokeWidth = 30;
    const mockPrimaryColor = 'rgba(0, 0, 0)';
    const mockCurrentFilter = document.createElement('filter');
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const renderer = 'renderer';
    brushService[renderer] = mockRenderer;
    const currentFilter = 'currentFilter';
    brushService[currentFilter] = mockCurrentFilter;
    const colorService = 'colorService';
    brushService[colorService].primaryColor = mockPrimaryColor;
    const strokeWidth = 'strokeWidth';
    brushService[strokeWidth] = mockStrokeWidth;
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    brushService.mouseDown(event, 1);
    const parentConst = 'parent';
    const prop = 'prop';
    expect(mockRenderer.appendChild).toHaveBeenCalledWith(brushService[parentConst], brushService[prop].element);

  });

  it('#should create a brush', () => {
    const mockStrokeWidth = 30;
    const mockPrimaryColor = 'rgba(0, 0, 0)';
    const mockCurrentFilter = document.createElement('filter');
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const renderer = 'renderer';
    brushService[renderer] = mockRenderer;
    const currentFilter = 'currentFilter';
    brushService[currentFilter] = mockCurrentFilter;
    const colorService = 'colorService';
    brushService[colorService].primaryColor = mockPrimaryColor;
    const strokeWidth = 'strokeWidth';
    brushService[strokeWidth] = mockStrokeWidth;
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    brushService.mouseDown(event, 1);

    expect(mockRenderer.createElement).toHaveBeenCalledWith(PATH.ELEMENT, PATH.LINK);

  });

  // Test mouseMove

  it('should do nothing', () => {

    const event = new MouseEvent('mousemove');
    const rendering = 'rendering';
    brushService[rendering] = false;
    const renderer = 'renderer';
    const spy = spyOn(brushService[renderer], 'setAttribute');
    brushService.mouseMove(event);
    expect(spy).not.toHaveBeenCalled();

  });

  it('should do nothing but enter in first if', () => {

    const event = new MouseEvent('mousemove');
    const rendering = 'rendering';
    brushService[rendering] = true;
    const renderer = 'renderer';
    const spy = spyOn(brushService[renderer], 'setAttribute');

    const mockOffsetX = 10;
    const mockOffsetY = 25;
    const prop = 'prop';
    const lastXPosition = 9;
    const lastYPosition = 24;
    brushService[prop].lastXPosition = lastXPosition;
    brushService[prop].lastYPosition = lastYPosition;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);

    brushService.mouseMove(event);
    expect(spy).not.toHaveBeenCalled();

  });

  it('should set setAttribute and lastX and lastY ', () => {

    const event = new MouseEvent('mousemove');
    const rendering = 'rendering';
    brushService[rendering] = true;

    const mockOffsetX = 10;
    const mockOffsetY = 25;
    const prop = 'prop';
    const lastXPosition = 5;
    const lastYPosition = 14;
    brushService[prop].lastXPosition = lastXPosition;
    brushService[prop].lastYPosition = lastYPosition;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const renderer = 'renderer';
    const spy = spyOn(brushService[renderer], 'setAttribute').and.callFake(
      (path: HTMLElement, d: string, position: string) => {
        expect(path).toEqual(brushService[prop].element);
        expect(d).toEqual(PATH.D);
        expect(position).toEqual(brushService[prop].position);
    });
    brushService.mouseMove(event);
    expect(spy).toHaveBeenCalled();
    expect(brushService[prop].lastXPosition).toEqual(mockOffsetX);
    expect(brushService[prop].lastYPosition).toEqual(mockOffsetY);
    expect(brushService[prop].position).toEqual('undefined, 10 25');
  });

  // Test mouseLeave()

  it('should leave currentlyDrawing at false', () => {
    const rendering = 'rendering';
    brushService[rendering] = false;
    brushService.mouseLeave();
    expect(brushService[rendering]).toEqual(false);
  });

  it('should set currentlyDrawing at false', () => {
    const rendering = 'rendering';
    brushService[rendering] = true;
    brushService.mouseLeave();
    expect(brushService[rendering]).toEqual(false);
  });

  // Test mouseUp
  it('should set currentlyDrawing at false', () => {
    const rendering = 'rendering';
    const event = new MouseEvent('mouseup');
    brushService[rendering] = true;
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const renderer = 'renderer';
    brushService[renderer] = mockRenderer;
    brushService.mouseUp(event);
    expect(brushService[rendering]).toEqual(false);
  });

  it('should leave currentlyDrawing at false', () => {
    const rendering = 'rendering';
    const event = new MouseEvent('mouseup');
    brushService[rendering] = false;
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const renderer = 'renderer';
    brushService[renderer] = mockRenderer;
    brushService.mouseUp(event);
    expect(brushService[rendering]).toEqual(false);
  });

  // setting attributes

  it('#should set path attributes correctly', () => {
    const mockPath = document.createElement('path');
    const mockPrimaryColor = 'rgba(0, 0, 0)';
    const mockStrokeWidth = '30';
    const mockCurrentFilter = document.createElement('filter');
    mockCurrentFilter.id = 'test';
    brushService.setPathAttributes(mockPath, mockRenderer, mockPrimaryColor, mockStrokeWidth, mockCurrentFilter, 1);

    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(mockPath, PATH.FILL, 'none');
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(mockPath, PATH.STROKE, mockPrimaryColor);
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(mockPath, PATH.STROKE_WIDTH, mockStrokeWidth);
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(mockPath, PATH.STROKE_LINECAP, 'round');
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(mockPath, PATH.FILTER, 'url(#' + mockCurrentFilter.getAttribute('id') + ')');
  });

  // parent node

  it('#should create parent correctly when mouseDown target is of type svg', () => {
    const mockTarget = jasmine.createSpyObj('HTMLElement', ['']);
    Object.defineProperty(mockTarget, 'nodeName', {value: 'svg'});
    const renderer = 'renderer';
    brushService[renderer] = mockRenderer;
    brushService.createParent(mockTarget);
    const parent = 'parent';
    expect(brushService[parent]).toEqual(mockTarget);
  });

  it('#should create parent correctly when mouseDown target is not of type svg', () => {
    const mockTarget = jasmine.createSpyObj('HTMLElement', ['']);
    const mockParent = jasmine.createSpyObj('HTMLElement', ['']);
    Object.defineProperty(mockTarget, 'nodeName', {value: ''});
    Object.defineProperty(mockTarget, 'parentNode', {value: mockParent});
    const renderer = 'renderer';
    brushService[renderer] = mockRenderer;
    brushService.createParent(mockTarget);
    const parent = 'parent';
    expect(brushService[parent]).toEqual(mockParent);
  });
});

import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from '../color/color.service';
import { PIPETTECONSTANTE } from './enum';
import { PipetteService } from './pipette.service';

enum ATT {
  RENDERER = 'renderer',
  PARENT = 'parent',
  COLOR_SERVICE = 'colorService'
}

describe('PipetteService', () => {
  let service: PipetteService;
  let colorService: ColorService;
  let rendererFactory: RendererFactory2;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2]
    });
    service = TestBed.get(PipetteService);
    colorService = TestBed.get(ColorService);
    rendererFactory = TestBed.get(RendererFactory2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service[ATT.RENDERER]).toBeTruthy();
  });

  // MouseDown
  it('should call local methods', () => {
    const event = new MouseEvent('mousedown', {});
    const spy1 = spyOn(service, 'setParent').and.returnValue();
    const spy2 = spyOn(service, 'getColor').and.returnValue();
    service.mouseDown(event);
    expect(spy1).toHaveBeenCalledWith(event);
    expect(spy2).toHaveBeenCalledWith(event);
  });

  // SetParent
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

  // pickColor
  it('should set primarycolor', () => {
    const event = new MouseEvent('mousedown', {button: 0});
    const rgba = 'rgba(200,200,200,200)';
    colorService.primaryColor = '';
    service.pickColor(event, rgba);
    expect(colorService.primaryColor).toEqual(rgba);
  });

  it('should set secondarycolor', () => {
    const event = new MouseEvent('mousedown', {button: 2});
    const rgba = 'rgba(200,200,200,200)';
    colorService.secondaryColor = '';
    service.pickColor(event, rgba);
    expect(colorService.secondaryColor).toEqual(rgba);
  });

  it('should set no color', () => {
    const event = new MouseEvent('mousedown', {button: 1});
    const rgba = 'rgba(200,200,200,200)';
    colorService.secondaryColor = '';
    colorService.primaryColor = '';
    service.pickColor(event, rgba);
    expect(colorService.secondaryColor).not.toEqual(rgba);
    expect(colorService.primaryColor).not.toEqual(rgba);
  });

  // GetColor
  it('should call encoder', () => {
    const event = new MouseEvent('mousedown', {});
    service[ATT.PARENT] = document.createElement('HTMLElement');
    const spyy = spyOn(global, 'encodeURIComponent').and.returnValue('test');

    service.getColor(event);
    expect(spyy).toHaveBeenCalledWith(new XMLSerializer().serializeToString(service[ATT.PARENT]));
    expect(service.img.src).toBe('data:image/svg+xml;charset=utf-8,test');
  });

  it('should pick the right color', () => {
    const event = new MouseEvent('mousedown', {clientX: 500, clientY: 500, button: 0});
    service[ATT.RENDERER] = rendererFactory.createRenderer(null, null);
    const tempElement = service[ATT.RENDERER].createElement('div');
    // tslint:disable-next-line: max-line-length
    tempElement.innerHTML = '<svg _ngcontent-fbb-c6="" width="747" height="744" style="background: rgba(0,0,0,0)" class="canvas" xmlns="http://www.w3.org/2000/svg"></svg>'.trim();
    service[ATT.PARENT] = tempElement.firstChild;
    service.getColor(event);
    const width = PIPETTECONSTANTE._747;
    const height = PIPETTECONSTANTE._744;
    spyOnProperty(service.img, 'width').and.returnValue(width);
    spyOnProperty(service.img, 'height').and.returnValue(height);
    const spy = spyOn(service, 'pickColor').and.returnValue();

    service.img.dispatchEvent(new Event('load'));

    // tslint:disable-next-line: max-line-length
    expect(spy).toHaveBeenCalledWith(event, 'rgba(0,0,0,0)');

  });
});

import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BucketService } from './bucket.service';

describe('BucketService', () => {
  let service: BucketService;
  let renderer: Renderer2;
  let rendererFactory: RendererFactory2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2]
    });
    service = TestBed.get(BucketService);
    rendererFactory = TestBed.get(RendererFactory2);
    renderer = jasmine.createSpyObj(['Renderer2', 'appendChild', 'createElement', 'setAttribute']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setSVG and setImage on mouseDown', () => {
    const event = new MouseEvent('mousedown', {});
    const id = 10;
    const parentSVG = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parentSVG);
    const spy1 = spyOn(service, 'setSVG');
    const spy2 = spyOn(service, 'setImage');
    service.mouseDown(event, id);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

  });

  it('should return an array of values on pickClickValue', () => {
    const r = 1;
    const g = 2;
    const b = 3;
    const value  = service.pickClickValue(r, g, b);
    expect(value).toEqual([r, g, b]);
  });

  it('should visit all adjacent pixels on visitPixels', () => {
    const currentPixel = [1, 1];
    const pixelToVisit = new Array();
    const matrixColor = 'matrixColor';
    const towsand = 1000;
    service[matrixColor] = [[towsand, towsand, towsand], [towsand, towsand, towsand], [towsand, towsand, towsand]];
    const mockImg = new Image();
    const number3 = 3;
    mockImg.height = number3;
    mockImg.width = number3;

    const img = 'img';
    service[img] = mockImg;

    const value = service.visitPixels(currentPixel, pixelToVisit);
    expect(value).toEqual([[2, 1], [1, 2]]);
  });

  it('should visit no pixels on visitPixels', () => {
    const currentPixel = [0, 0];
    const pixelToVisit = new Array();
    const matrixColor = 'matrixColor';
    const towsand = 1000;
    service[matrixColor] = [[towsand, towsand, towsand], [towsand, towsand, towsand], [towsand, towsand, towsand]];
    const mockImg = new Image();
    mockImg.height = 0;
    mockImg.width = 0;

    const img = 'img';
    service[img] = mockImg;

    const value = service.visitPixels(currentPixel, pixelToVisit);
    expect(value).toEqual([]);
  });

  it('should call append child after creating the fill svg', () => {
    const matrixColor = 'matrixColor';
    const towsand = 1000;
    service[matrixColor] = [[towsand, towsand, towsand, towsand],
                            [towsand, 0, 0, towsand],
                            [towsand, 0, 0, towsand],
                            [towsand, towsand, towsand, towsand]];

    const parent = document.createElement('svg');
    const id = 1;
    const rend = 'renderer';
    service[rend] = renderer;
    service.createFill(parent, id);
    expect(renderer.appendChild).toHaveBeenCalled();
  });

  it('should call encoder', () => {
    const event = new MouseEvent('mousedown', {});
    const id = 1;
    const parentSVG = document.createElement('HTMLElement');
    const spyy = spyOn(global, 'encodeURIComponent').and.returnValue('test');

    service.setImage(event, parentSVG, id);
    expect(spyy).toHaveBeenCalledWith(new XMLSerializer().serializeToString(parentSVG));
    expect(service.img.src).toBe('data:image/svg+xml;charset=utf-8,test');
  });

  it('should call create fill after creating the color matrix', () => {

    const rend = 'renderer';
    service[rend] = renderer;
    const tol = 'tolerance';
    service[tol] = 0;
    const id = 1;
    const event = new MouseEvent('mousedown', {clientX: 0, clientY: 0, button: 0});
    service[rend] = rendererFactory.createRenderer(null, null);
    const tempElement = service[rend].createElement('div');
    // tslint:disable-next-line: max-line-length
    tempElement.innerHTML = '<svg _ngcontent-fbb-c6="" width="10" height="10" style="background: rgba(0,0,0,0)" class="canvas" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" height="2" width="2" stroke="rgba(0, 0, 0)" stroke-width="10" fill="rgba(255, 255, 255)"></rect></svg>'.trim();
    const parentSVG = tempElement.firstChild;
    const spy = spyOn(service, 'createFill');
    service.setImage(event, parentSVG, id);
    const sevenfourseven = 747;
    spyOnProperty(service.img, 'width').and.returnValue(sevenfourseven);
    const sevenfourfour = 744;
    spyOnProperty(service.img, 'height').and.returnValue(sevenfourfour);

    service.img.dispatchEvent(new Event('load'));

    expect(spy).toHaveBeenCalled();

  });

  it('should set parent to parentNode of target', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockParent: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    const rend = 'renderer';
    service[rend] = renderer;
    Object.defineProperty(event, 'target', { get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });
    const value  = service.setSVG(event);
    expect(value).toBe(mockParent);
  });

});

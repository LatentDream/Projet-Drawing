import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { POLYGON } from '../../enum';
import { PolygonService } from './polygon.service';

describe('PolygonService', () => {
  let service: PolygonService;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(PolygonService);
    renderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

  });

  // Test for setParent

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

  // Tesy for mouseDown

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

  it('should create an polygon', () => {
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const spy = spyOn(service, 'setParent');
    service.mouseDown(event, 1);
    expect(renderer.createElement).toHaveBeenCalledWith(POLYGON.ELEMENT, POLYGON.LINK);
    expect(spy).toHaveBeenCalled();
  });

  it('should set polygon POINTS attribute', () => {
    const offsetX = 10;
    const offsetY = 25;
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;

    const mockOffsetX = offsetX;
    const mockOffsetY = offsetY;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.mouseDown(event, 1);
    const prop = 'prop';
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, POLYGON.POINTS, '10,25');

  });

  it('should set polygon attributes on type filled', () => {
    const numberOfTimeCalled = 5;
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const shapeService = 'shapeService';
    service[shapeService].shapeType = 'filled';
    const colorService = 'colorService';
    service[colorService].primaryColor = 'red';

    service.mouseDown(event, 1);
    expect(renderer.setAttribute).toHaveBeenCalledTimes(numberOfTimeCalled);
    const prop = 'prop';
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, POLYGON.STROKE_WIDTH, '0');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, POLYGON.FILL, 'red');

  });

  it('should set polygon attributes on type contour', () => {
    const strokeWidth = 10;
    const numberOfTimeCalled = 6;
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

    service.mouseDown(event, 1);
    expect(renderer.setAttribute).toHaveBeenCalledTimes(numberOfTimeCalled);
    const prop = 'prop';
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, POLYGON.STROKE_WIDTH, '10');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, POLYGON.STROKE, 'red');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, POLYGON.FILL_OPACITY, '0');

  });

  it('should set polygon attributes on type contourFilled', () => {
    const strokeWidth = 5;
    const numberOfTimeCalled = 6;
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const shapeService = 'shapeService';
    service[shapeService].shapeType = 'contourFilled';
    service[shapeService].strokeWidth = strokeWidth;
    const colorService = 'colorService';
    service[colorService].secondaryColor = 'blue';
    service[colorService].primaryColor = 'red';

    service.mouseDown(event, 1);
    expect(renderer.setAttribute).toHaveBeenCalledTimes(numberOfTimeCalled);
    const prop = 'prop';
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, POLYGON.STROKE, 'blue');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, POLYGON.STROKE_WIDTH, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element, POLYGON.FILL, 'red');
  });

  it('should append polygon on mousedown', () => {
    const event = new MouseEvent('mousedown', {});
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    service.mouseDown(event, 1);
    expect(renderer.appendChild).toHaveBeenCalled();
  });

  // Test for mouseUp()
  it('should set rendering at false on mouseUp', () => {
    const event = new MouseEvent('mouseup');
    const rendering = 'rendering';
    service.mouseUp(event);
    expect(service[rendering]).toEqual(false);
  });

  // Test for mouseLeave()
  it('should set rendering at false on mouseLeave', () => {
    const rendering = 'rendering';
    service.mouseLeave();
    expect(service[rendering]).toEqual(false);
  });

  // Test for insideAngle()
  it('should calculate right inside angle', () => {
    const nbSide = 6;
    const insideAngle = 1.0471975511965976;
    const shapeService = 'shapeService';
    service[shapeService].nbSides = nbSide;
    const prop = 'prop';
    service.insideAngle();
    expect(service[prop].insideAngleWeight).toEqual(insideAngle);
  });

  // Test for radiusLength()
  it('should calculate the right radius length', () => {
    const newY = 5;
    const radiusLenght = 5;
    const linePoints = 'linePoints';
    service[linePoints].newX = 1;
    service[linePoints].newY = newY;
    const prop = 'prop';
    service[prop].xTop = newY;
    service[prop].yTop = 2;
    service.radiusLenght();
    expect(service[prop].radiusLenght).toEqual(radiusLenght);
  });

  // test for nextPoint()
  it('should calculate the right next point with xTop < new X', () => {
    const angleMul = 3;
    const nbSides = 7;
    const newX = 4;
    const newY = 10;
    const angle = angleMul * 2 * Math.PI / nbSides ;

    const linePoints = 'linePoints';
    service[linePoints].newX = newX;
    service[linePoints].newY = newY;
    const prop = 'prop';
    service[prop].xTop = angleMul;
    service[prop].yTop = newY;
    service[prop].radiusLenght = 1;

    service.nextPoint(angle);
    expect(service[prop].nextPoint).toEqual('2.566116260882442,11.900968867902419');
  });

  it('should calculate the right next point with xTop > new X', () => {
    const angleMul = 3;
    const nbSides = 7;
    const tenValue = 10;
    const xTop = 5;
    const angle = angleMul * 2 * Math.PI / nbSides ;

    const linePoints = 'linePoints';
    service[linePoints].newX = angleMul;
    service[linePoints].newY = tenValue;
    const prop = 'prop';
    service[prop].xTop = xTop;
    service[prop].yTop = tenValue;
    service[prop].radiusLenght = 2;

    service.nextPoint(angle);
    expect(service[prop].nextPoint).toEqual('5.867767478235116,13.801937735804838');
  });

  it('should calculate the right next point with yTop < newY', () => {
    const nbSides = 4;
    const angleMul = 3;
    const xValues = 3;
    const newY = 11;
    const yTop = 10;
    const angle = angleMul * 2 * Math.PI / nbSides ;

    const linePoints = 'linePoints';
    service[linePoints].newX = xValues;
    service[linePoints].newY = newY;
    const prop = 'prop';
    service[prop].xTop = xValues;
    service[prop].yTop = yTop;
    service[prop].radiusLenght = 1;

    service.nextPoint(angle);
    expect(service[prop].nextPoint).toEqual('4,11');
  });

  it('should calculate the right next point with yTop > newY', () => {
    const nbSides = 4;
    const threeValue = 3;
    const newY = 10;
    const yTop = 12;
    const angle = threeValue * 2 * Math.PI / nbSides ;

    const linePoints = 'linePoints';
    service[linePoints].newX = threeValue;
    service[linePoints].newY = newY;
    const prop = 'prop';
    service[prop].xTop = threeValue;
    service[prop].yTop = yTop;
    service[prop].radiusLenght = 2;

    service.nextPoint(angle);
    expect(service[prop].nextPoint).toEqual('5,10');
  });

  // Test for mouseMove()

  it('should do nothing when rendering is false', () => {
    const event = new MouseEvent('mousemove');
    const rendering = 'rendering';
    service[rendering] = false;
    spyOn(service, 'insideAngle');
    service.mouseMove(event);
    expect(service.insideAngle).not.toHaveBeenCalled();
  });

  it('should call insideAngle and radiusLength when rendering is true', () => {
    const event = new MouseEvent('mousemove');
    const rendering = 'rendering';
    service[rendering] = true;
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    spyOn(service, 'insideAngle');
    spyOn(service, 'radiusLenght');
    service.mouseMove(event);
    expect(service.insideAngle).toHaveBeenCalled();
    expect(service.radiusLenght).toHaveBeenCalled();
  });

  it('should render a set points attribute', () => {
    const event = new MouseEvent('mousemove');
    const rendering = 'rendering';
    service[rendering] = true;
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const shapeService = 'shapeService';
    const nbSide = 3;
    const xTop = 25;
    const yTop = 30;
    service[shapeService].nbSides = nbSide;
    const insideAngleWeight = 2.0943951023931953;
    const prop = 'prop';
    service[prop].insideAngleWeight = insideAngleWeight;
    const mockOffsetX = 1;
    const mockOffsetY = 0;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service[prop].xTop = xTop;
    service[prop].yTop = yTop;

    service.mouseMove(event);

    expect(renderer.setAttribute).toHaveBeenCalledWith(service[prop].element,
      POLYGON.POINTS, ' 25,30 58.27160951922826,-27.62811813689563 -8.271609519228242,-27.62811813689565');
  });

});

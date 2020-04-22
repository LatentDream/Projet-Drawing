import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LinePoints } from 'src/app/classes/line-points';
import { CIRCLE, POLYLINE } from '../enum';
import { LineService } from './line.service';

class MockLinePoints extends LinePoints {}

describe('LineService', () => {

  let xTest: number;
  let yTest: number;
  let service: LineService;
  let mockSVGFilter: jasmine.SpyObj<SVGElement>;
  let mockSVG: jasmine.SpyObj<SVGElement>;
  let svg: HTMLElement;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2]
    });
    service = TestBed.get(LineService);
    const testX = 5;
    const testY = 10;
    xTest = testX;
    yTest = testY;
    mockSVG = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockSVG.setAttribute.and.callThrough();
    mockSVGFilter = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    mockSVGFilter.getAttribute.and.returnValue('5,10');
    svg = document.createElement('svg');
    renderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
  });

  afterEach(() => {
    svg.remove();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a renderer', () => {
    const rendererStr = 'renderer';
    expect(service[rendererStr]).toBeDefined();
  });

  // Test renderLine function
  it('should call setAttribute', () => {
  const rendererStr = 'renderer';
  const polylineStr = 'polyline';
  const linepointsStr = 'linePoints';
  const spy = spyOn(service[rendererStr], 'setAttribute').and.callFake(
      (polyLineReceived: SVGElement, att: string, listReceived: string) => {
        expect(polyLineReceived).toEqual(service[polylineStr]);
        expect(att).toEqual('points');
        expect(listReceived).toEqual(service[linepointsStr].points +  ' ' + xTest + ',' + yTest);
    });
  service.renderLine(xTest, yTest);
  expect(spy).toHaveBeenCalledWith(service[polylineStr], 'points', service[linepointsStr].points +  ' ' + xTest + ',' + yTest );
  });

  // Test de cancel function

  it('should call setAttribute and not removeChild with cancel', () => {
    const lineConnStr = 'lineConn';
    const rendererStr = 'renderer';
    const polylineStr = 'polyline';
    service[lineConnStr].connectorsArray.length = 0;
    const spy = spyOn(service[rendererStr], 'setAttribute').and.callFake((
      polyLineReceived: SVGElement, att: string, listReceived: string) => {
        expect(polyLineReceived).toEqual(service[polylineStr]);
        expect(att).toEqual('points');
        expect(listReceived).toEqual('');
      });

    const spy2 = spyOn(service[rendererStr], 'removeChild');
    service.cancel();
    expect(spy).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();

  });

  it('should call removeChild with cancel()', () => {
    const length = 5;
    const lineConnStr = 'lineConn';
    const rendererStr = 'renderer';
    service[lineConnStr].connectorsArray.length = length;
    const spy = spyOn(service[rendererStr], 'setAttribute');
    const spy2 = spyOn(service[rendererStr], 'removeChild').and.callFake((
      elementToRemove: HTMLElement, listElement: HTMLElement[]) => {
        const parentStr = 'parent';
        expect(elementToRemove).toEqual(service[parentStr]);
      }
    );
    service.cancel();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call mouseDoubleClick on cancel() when connectors Array length is 0', () => {
    const lineConnStr = 'lineConn';
    const rendererStr = 'renderer';
    service[lineConnStr].connectorsArray.length = 0;
    const spy = spyOn(service[rendererStr], 'setAttribute');
    const spy2 = spyOn(service, 'mouseDoubleClick');
    service.cancel();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  // Test HandleKeydown

  it('should call cancelSegment() with backspacekeyDownCall', () => {
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    spyOn(service, 'cancelSegment').and.callThrough();
    service.backspacekeyDownCall();

    expect(service.cancelSegment).toHaveBeenCalled();
  });

  it('should call cancel() with escapekeyDownCall', () => {
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    spyOn(service, 'cancel').and.callThrough();
    service.escapekeyDownCall();

    expect(service.cancel).toHaveBeenCalled();
  });

  it('should call renderForcedLine with shiftkeyDownCall', () => {
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].rendering = true;
    spyOn(service, 'renderForcedLine').and.callThrough();
    service.shiftkeyDownCall();

    expect(service.renderForcedLine).toHaveBeenCalled();
  });

  it('should call renderForcedLine with shiftkeyDownCall', () => {
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].rendering = false;
    spyOn(service, 'renderForcedLine').and.callThrough();
    service.shiftkeyDownCall();

    expect(service.renderForcedLine).not.toHaveBeenCalled();
  });

  // Test shiftkeyUpCall

  it('should call renderline() when shift is pressed', () => {
    const linePointsStr = 'linePoints';
    spyOn(service, 'renderLine').and.callThrough().and.callFake((
      pointX: number, pointY: number) => {
        expect(pointX).toEqual(service[linePointsStr].newX);
        expect(pointY).toEqual(service[linePointsStr].newY);
      }
    );
    service.shiftkeyUpCall();

    expect(service.renderLine).toHaveBeenCalled();
  });
  // Test mouseClick

  it('should enter in if and call 3 functions on mouseClick', () => {
    const event = new MouseEvent('click');
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].rendering = false;

    spyOn(service, 'setParent').and.callThrough().and.callFake((
      event1: MouseEvent) => {
        expect(event1).toEqual(event);
      }
    );

    spyOn(service, 'setStart').and.callThrough().and.callFake((
      event1: MouseEvent) => {
        expect(event1).toEqual(event);
      }
    );
    spyOn(service, 'addJunctions').and.callThrough();

    service.mouseClick(event, 1);
    expect(service[lineParamsStr].rendering).toEqual(true);
    expect(service.setParent).toHaveBeenCalled();
    expect(service.setStart).toHaveBeenCalled();
    expect(service.addJunctions).toHaveBeenCalled();
  });

  it('should enter in else if on mouseClick', () => {
    const event = new MouseEvent('click');
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].rendering = true;

    spyOn(service, 'addLineToPoly');
    spyOn(service, 'addJunctions').and.callThrough();

    service.mouseClick(event, 1);
    expect(service.addLineToPoly).toHaveBeenCalled();
    expect(service.addJunctions).toHaveBeenCalled();
  });

  // Test mouse Move function

  it('should enter in if and set newX and newY on MouseMove', () => {
    const event = new MouseEvent('mousemove');
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].rendering = true;
    const rendererStr = 'renderer';
    spyOn(service[rendererStr], 'setAttribute');

    const mockOffsetX = 10;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.mouseMove(event);
    const linePointsStr = 'linePoints';
    expect(service[linePointsStr].newX).toEqual(mockOffsetX);
    expect(service[linePointsStr].newY).toEqual(mockOffsetY);
  });

  it('should call renderForcedLine with shift on MouseMove', () => {
    const event = new MouseEvent('mousemove', {shiftKey: true});
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].rendering = true;
    const rendererStr = 'renderer';
    spyOn(service[rendererStr], 'setAttribute');
    spyOn(service, 'renderForcedLine').and.callThrough();

    service.mouseMove(event);
    expect(service.renderForcedLine).toHaveBeenCalled();
    expect(service.renderForcedLine).toHaveBeenCalled();
  });

  it('should call renderLine with parameters', () => {
    const linePointsStr = 'linePoints';
    const event = new MouseEvent('mousemove', {shiftKey: false});
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].rendering = true;

    spyOn(service, 'renderLine').and.callFake((
      pointX: number, pointY: number) => {
        expect(pointX).toEqual(service[linePointsStr].newX);
        expect(pointY).toEqual(service[linePointsStr].newY);
      }
    );

    service.mouseMove(event);
    expect(service.renderLine).toHaveBeenCalled();

  });

  it('should do nothing on mouseMove', () => {
    const linePointsStr = 'linePoints';
    const event = new MouseEvent('mousemove');
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].rendering = false;

    spyOn(service, 'renderLine').and.callFake((
      pointX: number, pointY: number) => {
        expect(pointX).toEqual(service[linePointsStr].newX);
        expect(pointY).toEqual(service[linePointsStr].newY);
      }
    );

    service.mouseMove(event);
    expect(service.renderLine).not.toHaveBeenCalled();

  });

  // Test mouseDoubleClick

  it('should setParameters on mouseDoubleClick ', () => {
    service.mouseDoubleClick();
    const lineParamsStr = 'lineParams';
    expect(service[lineParamsStr].rendering).toEqual(false);
    expect(service[lineParamsStr].firstDone).toEqual(false);
    const lineConnStr = 'lineConn';
    expect(service[lineConnStr].connectorsArray).toEqual([ ]);

  });

  // Test setStart

  it('should set startX and startY on setStart', () => {
    const event = new MouseEvent('click');
    const rendererStr = 'renderer';
    spyOn(service[rendererStr], 'appendChild');
    const mockOffsetX = 10;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const start = 10;
    service.setStart(event, start);
    const linePointsStr = 'linePoints';
    expect(service[linePointsStr].startX).toEqual(mockOffsetX);
    expect(service[linePointsStr].startY).toEqual(mockOffsetY);
    expect(service[linePointsStr].points).toEqual('10,5');
  });

  it('should call createElement and add it to polyline on setStart', () => {
    const event = new MouseEvent('click');
    const rendererStr = 'renderer';
    spyOn(service[rendererStr], 'setAttribute');
    spyOn(service[rendererStr], 'appendChild');
    const spy = spyOn(service[rendererStr], 'createElement').and.callFake((
      polyline: string, website: string) => {
        expect(polyline).toEqual('polyline');
        expect(website).toEqual('http://www.w3.org/2000/svg');
      }
    );
    const start = 10;
    service.setStart(event, start);
    expect(spy).toHaveBeenCalled();
  });

  it('should setAttribute on setStart', () => {
    const event = new MouseEvent('click');
    const rendererStr = 'renderer';
    spyOn(service[rendererStr], 'appendChild');
    service[rendererStr] = renderer;
    const colorServiceStr = 'colorService';
    service[colorServiceStr].primaryColor = 'red';
    const strokeWidthLineParam = 6;
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].strokeWidth = strokeWidthLineParam;
    const mockOffsetX = 10;
    const mockOffsetY = 25;
    const polylineStr = 'polyline';
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const start = 10;
    service.setStart(event, start);
    const nbTimes = 7;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[polylineStr], POLYLINE.STROKE, 'red');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[polylineStr], POLYLINE.STROKE_LINEJOIN, 'round');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[polylineStr], POLYLINE.STROKE_WIDTH, '6');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[polylineStr], POLYLINE.FILL, 'none');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[polylineStr], POLYLINE.POINTS, '10,25');
  });

  it('should call appendChild on setStart and rendering at true', () => {
    const event = new MouseEvent('click');
    const polylineStr = 'polyline';
    const rendererStr = 'renderer';
    const parentStr = 'parent';
    const spy = spyOn(service[rendererStr], 'appendChild').and.callFake((
      parent: HTMLElement, polyline: SVGElement) => {
        expect(parent).toEqual(service[parentStr]);
        expect(polyline).toEqual(service[polylineStr]);
      }
    );
    const start = 10;
    service.setStart(event, start);
    expect(spy).toHaveBeenCalledWith(service[parentStr], service[polylineStr]);
    const lineParamsStr = 'lineParams';
    expect(service[lineParamsStr].rendering).toEqual(true);
  });

  // Test addLineToPoly()

  it('should set lineConn.pointsAddLine', () => {
    const linePointsStr = 'linePoints';
    service[linePointsStr].points = '5,10';
    const polylineStr = 'polyline';
    service[polylineStr] = mockSVGFilter;
    service.addLineToPoly();
    const lineParamsStr = 'lineParams';
    expect(service[lineParamsStr].firstDone).toEqual(true);
  });

  it('should do nothing since you dont enter in if', () => {
    Object.defineProperty(service.linePoints, 'points', { value: null});
    spyOn(service, 'cancelSegment').and.callThrough();
    service.addLineToPoly();
    expect(service.cancelSegment).not.toHaveBeenCalled();
  });

  it('should setLast and linepoints.point', () => {
    Object.defineProperty(service.linePoints, 'points', { value: '5,10'});
    const mockPolyline: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    mockPolyline.getAttribute.withArgs('points').and.returnValue('5,10');
    service.polyline = mockPolyline;
    spyOn(service, 'setLast');
    service.addLineToPoly();
    expect(service.setLast).toHaveBeenCalled();
  });

  it('should call cancelSegment, mouseDoubleClick and renderLine', () => {
    Object.defineProperty(service.linePoints, 'points', { value: '5,10'});
    const linePointsStr = 'linePoints';
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].firstDone = true;

    const mockPolyline: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    mockPolyline.getAttribute.withArgs('points').and.returnValue('5,10');
    service.polyline = mockPolyline;
    spyOn(service, 'inRangeOfStart').and.returnValue(true);
    spyOn(service, 'cancelSegment');
    spyOn(service, 'mouseDoubleClick');
    spyOn(service, 'renderLine').and.callThrough().and.callFake((
      pointX: number, pointY: number) => {
        expect(pointX).toEqual(service[linePointsStr].startX);
        expect(pointY).toEqual(service[linePointsStr].startY);
      }
    );
    service.addLineToPoly();
    expect(service.cancelSegment).toHaveBeenCalled();
    expect(service.mouseDoubleClick).toHaveBeenCalled();
    expect(service.renderLine).toHaveBeenCalled();
  });

  it('should call getAttribute', () => {
    Object.defineProperty(service.linePoints, 'points', { value: '5,10'});
    const linePointsStr = 'linePoints';
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].firstDone = true;

    const mockPolyline: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    mockPolyline.getAttribute.withArgs('points').and.returnValue(null);
    service.polyline = mockPolyline;
    spyOn(service, 'inRangeOfStart').and.returnValue(false);
    spyOn(service, 'renderLine').and.callThrough().and.callFake((
      pointX: number, pointY: number) => {
        expect(pointX).toEqual(service[linePointsStr].startX);
        expect(pointY).toEqual(service[linePointsStr].startY);
      }
    );
    service.addLineToPoly();
    expect(service[lineParamsStr].firstDone).toEqual(true);
  });

  it('should set first done to true', () => {
    Object.defineProperty(service.linePoints, 'points', { value: '5,10'});
    const linePointsStr = 'linePoints';
    const lineParamsStr = 'lineParams';
    service[lineParamsStr].firstDone = true;

    const mockPolyline: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    mockPolyline.getAttribute.withArgs('points').and.returnValue('5,10');
    service.polyline = mockPolyline;
    spyOn(service, 'inRangeOfStart').and.returnValue(false);
    spyOn(service, 'renderLine').and.callThrough().and.callFake((
      pointX: number, pointY: number) => {
        expect(pointX).toEqual(service[linePointsStr].startX);
        expect(pointY).toEqual(service[linePointsStr].startY);
      }
    );
    service.addLineToPoly();
    expect(service[lineParamsStr].firstDone).toEqual(true);
  });

  // Test cancelSegment() function

  it('should NOT call mouseDoubleClick', () => {
    const linePointsStr = 'linePoints';
    service[linePointsStr].points = ' 0,0 1,1';
    const rendererStr = 'renderer';
    spyOn(service[rendererStr], 'setAttribute');
    const spy = spyOn(service, 'mouseDoubleClick').and.callThrough();
    service.cancelSegment();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call mouseDoubleClick', () => {
    const linePointsStr = 'linePoints';
    service[linePointsStr].points = '';
    const rendererStr = 'renderer';
    spyOn(service[rendererStr], 'setAttribute');
    const spy = spyOn(service, 'mouseDoubleClick').and.callThrough();
    service.cancelSegment();
    expect(spy).toHaveBeenCalled();
  });

  // test cancelJunctions() function

  it('should do nothing since the array length is 0', () => {
    const lineConnStr = 'lineConn';
    const rendererStr = 'renderer';
    service[lineConnStr].connectorsArray.length = 0;
    const spy = spyOn(service[rendererStr], 'removeChild');
    service.cancelJunctions();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should do call removeChild and pop', () => {
    const length = 5;
    const lineConnStr = 'lineConn';
    const rendererStr = 'renderer';
    service[lineConnStr].connectorsArray.length = length;
    const spy = spyOn(service[rendererStr], 'removeChild').and.callFake((
      elementToRemove: HTMLElement, listElement: HTMLElement[]) => {
        const parentStr = 'parent';
        expect(elementToRemove).toEqual(service[parentStr]);
      }
    );
    service.cancelJunctions();
    expect(spy).toHaveBeenCalled();
  });

  // test addJunctions() function

  it('should do nothing since there is no junction', () => {
    const lineConnStr = 'lineConn';
    const rendererStr = 'renderer';
    service[lineConnStr].connectorType = 'notJunction';
    const spy = spyOn(service[rendererStr], 'setAttribute');
    service.addJunctions();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call createElements', () => {
    const lineConnStr = 'lineConn';
    service[lineConnStr].connectorType = 'jonction';
    const rendererStr = 'renderer';
    spyOn(service[rendererStr], 'setAttribute');
    spyOn(service[rendererStr], 'appendChild');
    const linePointsStr = 'linePoints';
    const lastX = 5;
    const lastY = 10;
    service[linePointsStr].lastX = lastX;
    service[linePointsStr].lastY = lastY;
    const spy = spyOn(service[rendererStr], 'createElement').and.callFake((
      connector: string, website: string) => {
        expect(connector).toEqual('circle');
        expect(website).toEqual('http://www.w3.org/2000/svg');
      }
    );
    service.addJunctions();
    expect(spy).toHaveBeenCalled();
  });

  it('should call setAttribute 4 times with right param', () => {
    const lineConnStr = 'lineConn';
    service[lineConnStr].connectorType = 'jonction';
    const rendererStr = 'renderer';
    spyOn(service[rendererStr], 'appendChild');
    service[rendererStr] = renderer;
    const linePointsStr = 'linePoints';
    const lastX = 5;
    const lastY = 10;
    service[linePointsStr].lastX = lastX;
    service[linePointsStr].lastY = lastY;
    const colorServiceStr = 'colorService';
    service[colorServiceStr].primaryColor = 'red';
    const connectorWeight = 6;
    const nbTimes = 4;
    service[lineConnStr].connectorWeight = connectorWeight;

    service.addJunctions();
    const polylineStr = 'polyline';
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[polylineStr], CIRCLE.CX, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[polylineStr], CIRCLE.CY, '10');

  });

  it('should call appendChild', () => {
    const lineConnStr = 'lineConn';
    const rendererStr = 'renderer';
    const linePointsStr = 'linePoints';
    service[lineConnStr].connectorType = 'jonction';
    spyOn(service[rendererStr], 'setAttribute');
    const lastX = 5;
    const lastY = 10;
    service[linePointsStr].lastX = lastX;
    service[linePointsStr].lastY = lastY;
    const spy = spyOn(service[rendererStr], 'appendChild').and.callFake((
      elementToAdd: HTMLElement, listElement: HTMLElement[]) => {
        const parentStr = 'parent';
        expect(elementToAdd).toEqual(service[parentStr]);
        expect(listElement).toEqual(service[rendererStr].createElement('circle', 'http://www.w3.org/2000/svg'));
      }
    );

    service.addJunctions();
    expect(spy).toHaveBeenCalled();
  });

  it('should call push()', () => {
    const lineConnStr = 'lineConn';
    const rendererStr = 'renderer';
    const linePointsStr = 'linePoints';
    service[lineConnStr].connectorType = 'jonction';
    spyOn(service[rendererStr], 'appendChild');
    spyOn(service[rendererStr], 'setAttribute');
    const lastX = 5;
    const lastY = 10;
    service[linePointsStr].lastX = lastX;
    service[linePointsStr].lastY = lastY;
    const spy = spyOn(service[lineConnStr].connectorsArray, 'push');

    service.addJunctions();
    expect(spy).toHaveBeenCalled();
  });

  // Test renderForcedLine() function

  it('should renderLine with newX newY', () => {
    const lastTest = 5;
    const newTest = 10;
    const rendererStr = 'renderer';
    const linePointsStr = 'linePoints';
    service[linePointsStr].newX = 0;
    service[linePointsStr].lastX = lastTest;

    service[linePointsStr].newY = newTest;
    service[linePointsStr].lastY = lastTest;

    spyOn(service[rendererStr], 'setAttribute');
    spyOn(service, 'renderLine').and.callThrough().and.callFake((
      pointX: number, pointY: number) => {
        expect(pointX).toEqual(service[linePointsStr].newX);
        expect(pointY).toEqual(service[linePointsStr].newY);
      }
    );
    service.renderForcedLine();
    expect(service.renderLine).toHaveBeenCalled();

  });

  it('should renderLine with newX lastY', () => {
    const newLastValue = 5;
    const linePointsStr = 'linePoints';
    service[linePointsStr].newX = 0;
    service[linePointsStr].lastX = newLastValue;

    service[linePointsStr].newY = newLastValue;
    service[linePointsStr].lastY = newLastValue;
    const rendererStr = 'renderer';
    spyOn(service[rendererStr], 'setAttribute');
    spyOn(service, 'renderLine').and.callThrough().and.callFake((
      pointX: number, pointY: number) => {
        expect(pointX).toEqual(service[linePointsStr].newX);
        expect(pointY).toEqual(service[linePointsStr].lastY);
      }
    );
    service.renderForcedLine();
    expect(service.renderLine).toHaveBeenCalled();

  });

  it('should renderLine with lastX newY', () => {
    const newX = 5;
    const lastX = 4;
    const newY = 10000;
    const linePointsStr = 'linePoints';
    const rendererStr = 'renderer';
    service[linePointsStr].newX = newX;
    service[linePointsStr].lastX = lastX;

    service[linePointsStr].newY = newY;
    service[linePointsStr].lastY = 1;

    spyOn(service[rendererStr], 'setAttribute');
    spyOn(service, 'renderLine').and.callThrough().and.callFake((
      pointX: number, pointY: number) => {
        expect(pointX).toEqual(service[linePointsStr].lastX);
        expect(pointY).toEqual(service[linePointsStr].newY);
      }
    );
    service.renderForcedLine();
    expect(service.renderLine).toHaveBeenCalled();

  });

  it('should renderLine with newX and (lastY - lastX - newX)', () => {
    const newVal = 5;
    const last = 4;
    const linePointsStr = 'linePoints';
    service[linePointsStr].newX = newVal;
    service[linePointsStr].lastX = last;
    const rendererStr = 'renderer';

    service[linePointsStr].newY = newVal;
    service[linePointsStr].lastY = last;

    spyOn(service[rendererStr], 'setAttribute');
    spyOn(service, 'renderLine').and.callThrough().and.callFake((
      pointX: number, pointY: number) => {
        expect(pointX).toEqual(service[linePointsStr].newX);
        expect(pointY).toEqual(service[linePointsStr].lastY - (service[linePointsStr].lastX - service[linePointsStr].newX));
      }
    );
    service.renderForcedLine();
    expect(service.renderLine).toHaveBeenCalled();

  });

  it('should set parent to parentNode of target', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockParent: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    mockSVG = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    const rendererStr = 'renderer';
    service[rendererStr] = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
    Object.defineProperty(event, 'target', { get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });

    service.setParent(event);
    const parentStr = 'parent';
    expect(service[parentStr]).toBe(mockParent);
  });

  it('should set parent to target', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockTarget: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    Object.defineProperty(mockTarget, 'nodeName', { value: 'svg' });
    const rendererStr = 'renderer';
    service[rendererStr] = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
    Object.defineProperty(event, 'target', { value: mockTarget });

    service.setParent(event);
    const parentStr = 'parent';
    expect(service[parentStr]).toBe(mockTarget);
  });

  // test setLast() function
  it('should set linePoints.lastX and linePoints.lastY', () => {
    const mockLinePoints = new MockLinePoints();
    mockLinePoints.lastX = 0;
    mockLinePoints.lastY = 0;
    mockLinePoints.points = ' 500,600';
    const linePointsStr = 'linePoints';
    service[linePointsStr] = mockLinePoints;
    const lastX = 500;
    const lastY = 600;
    service.setLast();
    expect(service[linePointsStr].lastX).toBe(lastX);
    expect(service[linePointsStr].lastY).toBe(lastY);
  });

  // test in Range of Start

  it('should be out of range and return true', () => {
    const startValue = 12;
    const lastValue = 10;
    const linePointsStr = 'linePoints';
    service[linePointsStr].startX = startValue;
    service[linePointsStr].lastX = lastValue;

    service[linePointsStr].startY = startValue;
    service[linePointsStr].lastY = lastValue;

    const result = service.inRangeOfStart();
    expect(result).toBe(true);
  });

  it('should be out of range and return false', () => {
    const startXtest =  12;
    const lastValue = 10;
    const startY = 15;
    const linePointsStr = 'linePoints';
    service[linePointsStr].startX = startXtest;
    service[linePointsStr].lastX = lastValue;

    service[linePointsStr].startY = startY;
    service[linePointsStr].lastY = lastValue;

    const result = service.inRangeOfStart();
    expect(result).toBe(false);
  });

  it('should be out of range and return false', () => {
    const startXTest = 15;
    const lastTest = 10;
    const startYTest = 12;
    const linePointsStr = 'linePoints';
    service[linePointsStr].startX = startXTest;
    service[linePointsStr].lastX = lastTest;

    service[linePointsStr].startY = startYTest;
    service[linePointsStr].lastY = lastTest;

    const result = service.inRangeOfStart();
    expect(result).toBe(false);
  });

  // test getSubstring

  it('should return substring index', () => {
    const mockLinePoints = new MockLinePoints();

    mockLinePoints.lastX = 0;
    mockLinePoints.lastY = 0;
    mockLinePoints.points = ' 500,600';
    const linePointsStr = 'linePoints';
    service[linePointsStr] = mockLinePoints;
    const result = service.getSubstring();
    expect(result).toEqual(service[linePointsStr].points.substring(0, service[linePointsStr].points.lastIndexOf(' ')));
  });

// Garder les tests ensembles
// tslint:disable-next-line: max-file-line-count
});

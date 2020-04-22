import { Renderer2} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EraseService } from './erase.service';

describe('EraseService', () => {
  let service: EraseService;
  let mockRenderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(EraseService);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute', 'getAttribute', 'removeChild']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call function detectAndDelete on mousedown', () => {
    const event = new MouseEvent('mousedown', {});
    const spy = spyOn(service, 'detectAndDeleteIntersection');
    service.mouseDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should set parent to target', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockTarget: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const mockParent: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    Object.defineProperty(mockTarget, 'nodeName', { value: 'svg' });
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    Object.defineProperty(event, 'target', { value: mockTarget });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });
    service.setParent(event);
    const parent = 'parent';
    expect(service[parent]).toBe(mockTarget);
  });

  it('should set parent to parentNode of target', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockParent: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    Object.defineProperty(event, 'target', { get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });
    service.setParent(event);
    const parent = 'parent';
    expect(service[parent]).toBe(mockParent);
  });

  it('should call function detectAndDeleteIntersection on mouseMove if mousedown', () => {
    const event = new MouseEvent('mousemove', {});
    const mockParent: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    Object.defineProperty(event, 'target', { get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });
    const mouseDownBool = 'mouseDownBool';
    service[mouseDownBool] = true;
    const three = 3;
    service.eraserSize = three;
    const spy = spyOn(service, 'detectAndDeleteIntersection').and.callFake(() => { return; });
    spyOn(service, 'detectAndHighlight').and.callFake(() => { return; });
    service.mouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call function detectAndHighlight on mouseMove', () => {
    const event = new MouseEvent('mousemove', {});
    const mockParent: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const three = 3;
    service.eraserSize = three;
    Object.defineProperty(event, 'target', { get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });
    const spy = spyOn(service, 'detectAndHighlight').and.callFake(() => { return; });
    service.mouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should not find intersection between 2 binding boxes', () => {
    const mockBox1: jasmine.SpyObj<DOMRect> = jasmine.createSpyObj('DOMRect', ['']);
    Object.defineProperty(mockBox1, 'x', {value: 2});
    Object.defineProperty(mockBox1, 'width', {value: 4});
    const mockBox2: jasmine.SpyObj<DOMRect> = jasmine.createSpyObj('DOMRect', ['']);
    Object.defineProperty(mockBox2, 'x', {value: 3});
    Object.defineProperty(mockBox2, 'width', {value: 1});
    const reponse = service.DoBoxesIntersect(mockBox1, mockBox2);
    expect(reponse).toBe(false);
  });

  it('should find intersection element', () => {
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const prop = 'prop';
    service[prop].element = jasmine.createSpyObj('Node', ['getBoundingClientRect']);
    Object.defineProperty(service[nodes], 'length', {value: 1});
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    const node2 = jasmine.createSpyObj('Node', ['getBoundingClientRect']);
    service[nodes][0] = node1;
    service[nodes][1] = node2;
    const spy = spyOn(service, 'DoBoxesIntersect').and.callFake(() => true);
    service.findIntersectionElement();
    expect(spy).toHaveBeenCalled();
  });

  it('should find NOT intersection element', () => {
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const prop = 'prop';
    service[prop].element = jasmine.createSpyObj('Node', ['getBoundingClientRect']);
    Object.defineProperty(service[nodes], 'length', {value: 1});
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    const node2 = jasmine.createSpyObj('Node', ['getBoundingClientRect']);
    service[nodes][0] = node1;
    service[nodes][1] = node2;
    const spy = spyOn(service, 'DoBoxesIntersect').and.callFake(() => false);
    service.findIntersectionElement();
    expect(spy).toHaveBeenCalled();
  });

  it('should call function detectAndDelete on mouseClick', () => {
    const event = new MouseEvent('mousedown', {});
    const spy = spyOn(service, 'detectAndDeleteIntersection');
    service.mouseClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should change sqaureSVGCreated to false on mouseLeave', () => {
    const squareSVGCreated = 'squareSVGCreated';
    service[squareSVGCreated] = true;
    service.mouseLeave();
    expect(service[squareSVGCreated]).toBe(false);
  });

  it('should NOT append child if sqaure already exists ', () => {
    const event = new MouseEvent('mousedown', {});
    const squareSVGCreated = 'squareSVGCreated';
    spyOn(service, 'setParent').and.callFake(() => {return; });
    const renderer = 'renderer';
    const three = 3;
    service.eraserSize = three;
    service[renderer] = mockRenderer;
    service[squareSVGCreated] = true;
    service.updateSquare(event);
    expect(mockRenderer.appendChild).toHaveBeenCalledTimes(0);
  });

  it('should change mouseDownBool to false on MouseUp', () => {
    const event = new MouseEvent('mouseup', {});
    const mouseDownBool = 'mouseDownBool';
    service[mouseDownBool] = true;
    service.mouseUp(event);
    expect(service[mouseDownBool]).toBe(false);
  });

  it('should return element color of rect', () => {
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const black = 'black';
    Object.defineProperty(mockSVGElement, 'localName', {value: 'rect'});
    Object.defineProperty(mockSVGElement, 'stroke', {value: black});
    mockSVGElement.getAttribute.and.callFake((attr: string) => {
      return black;
    });
    const color = service.getColor(mockSVGElement);
    expect(color).toEqual(black);

  });

  it('should return element color of group if group of circles', () => {
    const mockParentSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const black = 'black';
    Object.defineProperty(mockParentSVGElement, 'nodeName', {value: 'g'});
    Object.defineProperty(mockSVGElement, 'localName', {value: 'circle'});
    Object.defineProperty(mockSVGElement, 'parentNode', {value: mockParentSVGElement});
    Object.defineProperty(mockParentSVGElement, 'stroke', {value: black});
    mockSVGElement.getAttribute.and.callFake((attr: string) => {
      return black;
    });
    const color = service.getColor(mockSVGElement);
    expect(color).toEqual(black);

  });

  it('should return element color of ellipse', () => {
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const black = 'black';
    Object.defineProperty(mockSVGElement, 'localName', {value: 'ellipse'});
    Object.defineProperty(mockSVGElement, 'stroke', {value: black});
    mockSVGElement.getAttribute.and.callFake((attr: string) => {
      return black;
    });
    const color = service.getColor(mockSVGElement);
    expect(color).toEqual(black);

  });

  it('should return element color of line', () => {
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const black = 'black';
    Object.defineProperty(mockSVGElement, 'localName', {value: 'polyline'});
    Object.defineProperty(mockSVGElement, 'stroke', {value: black});
    mockSVGElement.getAttribute.and.callFake((attr: string) => {
      return black;
    });
    const color = service.getColor(mockSVGElement);
    expect(color).toEqual(black);

  });

  it('should return element color of polygon', () => {
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const black = 'black';
    Object.defineProperty(mockSVGElement, 'localName', {value: 'polygon'});
    Object.defineProperty(mockSVGElement, 'stroke', {value: black});
    mockSVGElement.getAttribute.and.callFake((attr: string) => {
      return black;
    });
    const color = service.getColor(mockSVGElement);
    expect(color).toEqual(black);

  });

  it('should return element color of path', () => {
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const black = 'black';
    Object.defineProperty(mockSVGElement, 'localName', {value: 'path'});
    Object.defineProperty(mockSVGElement, 'stroke', {value: black});
    mockSVGElement.getAttribute.and.callFake((attr: string) => {
      return black;
    });
    const color = service.getColor(mockSVGElement);
    expect(color).toEqual(black);

  });

  it('should return null if no OwnerSVG', () => {
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const prop = 'prop';
    service[prop].element = mockSVGElement;
    expect(service.returnOwnerSVGElement()).toEqual(null);
  });

  it('should remove highlight if highlighted element is a circle', () => {
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    const mockElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    Object.defineProperty(mockElement, 'parentNode', {value: mockParentElement});
    const highlightedElement = 'highlightedElement';
    Object.defineProperty(mockElement, 'localName', {value : 'circle'});
    service[highlightedElement] = mockElement;
    const mockNodes: jasmine.SpyObj<NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement
                                              | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>>
                                              = jasmine.createSpyObj('NodeList', ['']);
    Object.defineProperty(mockNodes, 'length', {value: 1});
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    service[nodes][0] = node1;
    service.removeHighlight();
    expect(mockRenderer.setAttribute).toHaveBeenCalled();

  });

  it('should remove highlight if highlighted element is a path', () => {
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    const mockElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const highlightedElement = 'highlightedElement';
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    Object.defineProperty(mockElement, 'parentNode', {value: mockParentElement});
    Object.defineProperty(mockElement, 'localName', {value : 'path'});
    service[highlightedElement] = mockElement;
    const mockNodes: jasmine.SpyObj<NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement
                                              | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>>
                                              = jasmine.createSpyObj('NodeList', ['']);
    Object.defineProperty(mockNodes, 'length', {value: 1});
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    service[nodes][0] = node1;
    service.removeHighlight();
    expect(mockRenderer.setAttribute).toHaveBeenCalled();

  });

  it('should remove highlight if highlighted element is a line', () => {
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    const mockElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const highlightedElement = 'highlightedElement';
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    Object.defineProperty(mockElement, 'parentNode', {value: mockParentElement});
    Object.defineProperty(mockElement, 'localName', {value : 'polyline'});
    service[highlightedElement] = mockElement;
    const mockNodes: jasmine.SpyObj<NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement
                                              | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>>
                                              = jasmine.createSpyObj('NodeList', ['']);
    Object.defineProperty(mockNodes, 'length', {value: 1});
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    service[nodes][0] = node1;
    service.removeHighlight();
    expect(mockRenderer.setAttribute).toHaveBeenCalled();

  });

  it('should remove highlight if highlighted element is a ellipse', () => {
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    const mockElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const highlightedElement = 'highlightedElement';
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    Object.defineProperty(mockElement, 'parentNode', {value: mockParentElement});
    Object.defineProperty(mockElement, 'localName', {value : 'ellipse'});
    service[highlightedElement] = mockElement;
    const mockNodes: jasmine.SpyObj<NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement
                                              | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>>
                                              = jasmine.createSpyObj('NodeList', ['']);
    Object.defineProperty(mockNodes, 'length', {value: 1});
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    service[nodes][0] = node1;
    service.removeHighlight();
    expect(mockRenderer.setAttribute).toHaveBeenCalled();

  });

  it('should remove highlight if highlighted element is a polygon', () => {
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    const mockElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const highlightedElement = 'highlightedElement';
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    Object.defineProperty(mockElement, 'parentNode', {value: mockParentElement});
    Object.defineProperty(mockElement, 'localName', {value : 'polygon'});
    service[highlightedElement] = mockElement;
    const mockNodes: jasmine.SpyObj<NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement
                                              | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>>
                                              = jasmine.createSpyObj('NodeList', ['']);
    Object.defineProperty(mockNodes, 'length', {value: 1});
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    service[nodes][0] = node1;
    service.removeHighlight();
    expect(mockRenderer.setAttribute).toHaveBeenCalled();

  });

  it('should remove highlight if highlighted element is a path', () => {
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const mockElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const highlightedElement = 'highlightedElement';
    Object.defineProperty(mockParentElement, 'nodeName', {value : 'g'});
    Object.defineProperty(mockElement, 'parentNode', {value : mockParentElement});
    Object.defineProperty(mockElement, 'localName', {value : 'path'});
    service[highlightedElement] = mockElement;
    const mockNodes: jasmine.SpyObj<NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement
                                              | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>>
                                              = jasmine.createSpyObj('NodeList', ['']);
    Object.defineProperty(mockNodes, 'length', {value: 1});
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    service[nodes][0] = node1;
    service.removeHighlight();
    expect(mockRenderer.setAttribute).toHaveBeenCalled();

  });

  it('should highlight element if it is a group of circles', () => {
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    Object.defineProperty(mockParentElement, 'localName', {value: 'g'});
    Object.defineProperty(node1, 'localName', {value: 'circle'});
    Object.defineProperty(node1, 'parentNode', {value: mockParentElement});
    spyOn(service, 'getColor').and.returnValue('black');
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 0;
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    service.highlightElement();
    expect(mockRenderer.setAttribute).toHaveBeenCalled();
  });

  it('should highlight element if it is a group of path', () => {
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    Object.defineProperty(mockParentElement, 'localName', {value: 'g'});
    Object.defineProperty(node1, 'localName', {value: 'path'});
    Object.defineProperty(node1, 'parentNode', {value: mockParentElement});
    spyOn(service, 'getColor').and.returnValue('black');
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 0;
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    service.highlightElement();
    expect(mockRenderer.setAttribute).toHaveBeenCalled();
  });

  it('should highlight element if it is a polyline', () => {
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    Object.defineProperty(mockParentElement, 'localName', {value: 'svg'});
    Object.defineProperty(node1, 'localName', {value: 'polyline'});
    Object.defineProperty(node1, 'parentNode', {value: mockParentElement});
    spyOn(service, 'getColor').and.returnValue('black');
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 0;
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    service.highlightElement();
    expect(mockRenderer.setAttribute).toHaveBeenCalled();
  });

  it('should highlight element if it is a rect', () => {
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    Object.defineProperty(mockParentElement, 'localName', {value: 'svg'});
    Object.defineProperty(node1, 'localName', {value: 'rect'});
    Object.defineProperty(node1, 'parentNode', {value: mockParentElement});
    spyOn(service, 'getColor').and.returnValue('black');
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 0;
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    service.highlightElement();
    expect(mockRenderer.setAttribute).toHaveBeenCalled();
  });

  it('should not highlight element if color is red', () => {
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    Object.defineProperty(node1, 'localName', {value: 'circle'});
    spyOn(service, 'getColor').and.returnValue('red');
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 0;
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    service.highlightElement();
    expect(mockRenderer.setAttribute).toHaveBeenCalledTimes(0);
  });

  it('should not highlight element if parent node doesnt exist', () => {
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    Object.defineProperty(node1, 'localName', {value: 'rect'});
    spyOn(service, 'getColor').and.returnValue('black');
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 0;
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    service.highlightElement();
    expect(mockRenderer.setAttribute).toHaveBeenCalledTimes(0);
  });

  it('should remove highlight', () => {
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    const mockElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const highlightedElement = 'highlightedElement';
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    Object.defineProperty(mockElement, 'parentNode', {value: mockParentElement});
    Object.defineProperty(mockElement, 'localName', {value : 'rect'});
    service[highlightedElement] = mockElement;
    const mockNodes: jasmine.SpyObj<NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement
                                              | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>>
                                              = jasmine.createSpyObj('NodeList', ['']);
    Object.defineProperty(mockNodes, 'length', {value: 1});
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 2;
    service.removeHighlight();
    expect(mockRenderer.setAttribute).toHaveBeenCalled();

  });

  it('should NOT remove highlight', () => {
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    const mockElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const highlightedElement = 'highlightedElement';
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    Object.defineProperty(mockElement, 'parentNode', {value: mockParentElement});
    Object.defineProperty(mockElement, 'localName', {value : 'ggg'});
    service[highlightedElement] = mockElement;
    const mockNodes: jasmine.SpyObj<NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement
                                              | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>>
                                              = jasmine.createSpyObj('NodeList', ['']);
    Object.defineProperty(mockNodes, 'length', {value: 1});
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 2;
    service.removeHighlight();
    expect(mockRenderer.setAttribute).toHaveBeenCalledTimes(0);
  });

  it('should NOT remove highlight', () => {
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    const mockElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const highlightedElement = 'highlightedElement';
    Object.defineProperty(mockElement, 'localName', {value : 'ggg'});
    service[highlightedElement] = mockElement;
    const mockNodes: jasmine.SpyObj<NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement
                                              | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>>
                                              = jasmine.createSpyObj('NodeList', ['']);
    Object.defineProperty(mockNodes, 'length', {value: 1});
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 2;
    service.removeHighlight();
    expect(mockRenderer.setAttribute).toHaveBeenCalledTimes(0);
  });

  it('should not highlight element if there is not root element', () => {
    spyOn(service, 'returnOwnerSVGElement').and.callFake(() => null);
    const spy = spyOn(service, 'highlightElement');
    service.detectAndHighlight();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should detect and highlight element under eraser svg', () => {
    const event = new MouseEvent('mousedown', {});
    const mockTarget: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const mockParent: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['appendChild']);
    const mockRoot: jasmine.SpyObj<SVGSVGElement> =  jasmine.createSpyObj('SVGSVGElement', ['getBBox', 'getIntersectionList']);
    const mockNodes: jasmine.SpyObj<NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement
                                  | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>>
                                  = jasmine.createSpyObj('NodeList', ['']);
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    Object.defineProperty(mockTarget, 'nodeName', { value: 'svg' });
    Object.defineProperty(event, 'target', { value: mockTarget });
    Object.defineProperty(mockNodes, 'length', {value: 1});
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });
    mockRoot.getIntersectionList.and.returnValue(mockNodes);
    spyOn(service, 'returnOwnerSVGElement').and.returnValue(mockRoot);
    const firstItemHighlighted = 'firstItemHighlighted';
    service[firstItemHighlighted] = true;
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 0;
    const spy = spyOn(service, 'findIntersectionElement');
    service.detectAndHighlight();
    expect(spy).toHaveBeenCalled();
  });

  it('should detect and delete element under eraser svg', () => {
    const event = new MouseEvent('mousedown', {});
    const mockTarget: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    const mockParent: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['appendChild']);
    const mockRoot: jasmine.SpyObj<SVGSVGElement> =  jasmine.createSpyObj('SVGSVGElement', ['getBBox', 'getIntersectionList']);
    const mockNodes: jasmine.SpyObj<NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement
                                  | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>>
                                  = jasmine.createSpyObj('NodeList', ['']);
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    Object.defineProperty(mockTarget, 'nodeName', { value: 'svg' });
    Object.defineProperty(event, 'target', { value: mockTarget });
    Object.defineProperty(mockNodes, 'length', {value: 1});
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });
    mockRoot.getIntersectionList.and.returnValue(mockNodes);
    spyOn(service, 'returnOwnerSVGElement').and.returnValue(mockRoot);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    service[nodes][0] = node1;
    const spy = spyOn(service, 'deleteElement');
    service.detectAndDeleteIntersection();
    expect(spy).toHaveBeenCalled();
  });

  it('should delete element if bucket element', () => {
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    Object.defineProperty(node1, 'localName', {value: 'path'});
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['appendChild']);
    Object.defineProperty(mockParentElement, 'localName', {value: 'g'});
    Object.defineProperty(node1, 'parentNode', {value: mockParentElement});
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 0;
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    service.deleteElement();
    expect(mockRenderer.removeChild).toHaveBeenCalled();
  });

  it('should delete element if spray element', () => {
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    Object.defineProperty(node1, 'localName', {value: 'circle'});
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['appendChild']);
    Object.defineProperty(mockParentElement, 'localName', {value: 'g'});
    Object.defineProperty(node1, 'parentNode', {value: mockParentElement});
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 0;
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    service.deleteElement();
    expect(mockRenderer.removeChild).toHaveBeenCalled();
  });

  it('should delete element ', () => {
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    Object.defineProperty(node1, 'localName', {value: 'path'});
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['appendChild']);
    Object.defineProperty(mockParentElement, 'localName', {value: 'gg'});
    Object.defineProperty(node1, 'parentNode', {value: mockParentElement});
    service[nodes][0] = node1;
    const node = 'node';
    service[node] = 0;
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    service.deleteElement();
    expect(mockRenderer.removeChild).toHaveBeenCalled();
  });

  it('should NOT delete element', () => {
    const mockHtmlRoot: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const parent = 'parent';
    service[parent] = mockHtmlRoot;
    const nodes = 'nodes';
    service[nodes] =  jasmine.createSpyObj('NodeList', ['']);
    const node1 = jasmine.createSpyObj('Path', ['getBoundingClientRect']);
    Object.defineProperty(node1, 'localName', {value: 'circle'});
    service[nodes][0] = node1;
    const node = 'node';
    const three = 3;
    service[node] = three;
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    service.deleteElement();
    expect(mockRenderer.removeChild).toHaveBeenCalledTimes(0);
  });

  it('should do nothing if ownerSVGElement does not exist', () => {
    const renderer = 'renderer';
    service[renderer] = mockRenderer;
    spyOn(service, 'returnOwnerSVGElement').and.returnValue(null);
    service.detectAndDeleteIntersection();
    expect(mockRenderer.removeChild).toHaveBeenCalledTimes(0);
  });

// pour la clarite du code on trouve que cest mieux de garder tous les tests dun service dand un fichier au
// lieu de separer les tests en deux fichier
// tslint:disable-next-line: max-file-line-count
});

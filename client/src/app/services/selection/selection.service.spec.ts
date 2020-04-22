import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SELECTION } from '../enum';
import { SelectionService } from './selection.service';

describe('SelectionService', () => {
  let service: SelectionService;
  let mockRenderer: Renderer2;
  let mockSVGFilter: jasmine.SpyObj<SVGElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2]
    });
    service = TestBed.get(SelectionService);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'setAttribute', 'removeChild', 'createElement']);
    const rendererStr = 'renderer';
    service[rendererStr] = mockRenderer;
    mockSVGFilter = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    mockSVGFilter.getAttribute.and.returnValue('5,10');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // initialiseHotkeys
  it('should initialize hotkeys at false', () => {
    service.initialiseHotkeys();
    const hotkeyMap = 'hotkeys';
    expect(service[hotkeyMap].has(SELECTION.ARROWRIGHT)).toBe(true);
    expect(service[hotkeyMap].has(SELECTION.ARROWUP)).toBe(true);
    expect(service[hotkeyMap].has(SELECTION.ARROWLEFT)).toBe(true);
    expect(service[hotkeyMap].has(SELECTION.ARROWDOWN)).toBe(true);
    expect(service[hotkeyMap].has(SELECTION.FIRSTTRANSLATIONHOLD)).toBe(true);

  });

  // mouseDown
  it('should set parameters to right value', () => {
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    spyOnProperty(event, 'target').and.returnValue(parent);
    const eventButton = 0;
    spyOnProperty(event, 'button').and.returnValue(eventButton);
    service.mouseDown(event, mockSVG);
    const selectionParam = 'selectionParameters';
    expect(service[selectionParam].leftClick).toEqual(true);
    expect(service[selectionParam].rightClick).toEqual(false);
    expect(service[selectionParam].dragDrop).toEqual(true);
  });

  it('should set mouseDown action to selection with id', () => {
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    spyOnProperty(event, 'target').and.returnValue(parent);
    const eventButton = 0;
    const rendererStr = 'renderer';
    service[rendererStr].setAttribute(mockSVG, 'id', '2');
    mockSVG.getAttribute.withArgs('id').and.returnValue('2');
    spyOnProperty(event, 'button').and.returnValue(eventButton);
    service.mouseDown(event, mockSVG);
    const selectionParam = 'selectionParameters';
    expect(service[selectionParam].mouseMoveAction).toEqual('selection');
  });

  it('should set left click to false, right click to true and mouse action to selection', () => {
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    spyOnProperty(event, 'target').and.returnValue(parent);
    const eventButton = 2;
    spyOnProperty(event, 'button').and.returnValue(eventButton);
    service.mouseDown(event, mockSVG);
    const selectionParam = 'selectionParameters';
    expect(service[selectionParam].leftClick).toEqual(false);
    expect(service[selectionParam].rightClick).toEqual(true);
    expect(service[selectionParam].mouseMoveAction).toEqual('selection');
  });

  it('should set left and right click to false', () => {
    const event = new MouseEvent('mousedown');
    const parent = document.createElement('svg');
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    spyOnProperty(event, 'target').and.returnValue(parent);
    const eventButton = 3;
    spyOnProperty(event, 'button').and.returnValue(eventButton);
    service.mouseDown(event, mockSVG);
    const selectionParam = 'selectionParameters';
    expect(service[selectionParam].leftClick).toEqual(false);
    expect(service[selectionParam].rightClick).toEqual(false);
  });

  // mouseUp
  it('should remove selectionRect from canvas', () => {
    const event = new MouseEvent('mouseup');
    const parent = document.createElement('svg');
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    spyOnProperty(event, 'target').and.returnValue(parent);
    const selectionParam = 'selectionParameters';
    const mockSelectionRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const rendererStr = 'renderer';
    service[selectionParam].selectionRect = mockSelectionRect;
    service.mouseUp(event, mockSVG);
    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockSVG, mockSelectionRect);
  });

  it('should return', () => {
    const event = new MouseEvent('mouseup');
    const mockParentSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockTargetSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockCanvasSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    spyOnProperty(event, 'target').and.returnValue(mockTargetSVG);
    Object.defineProperty(event.target, 'parentNode', { value: mockParentSVG});
    mockParentSVG.getAttribute.withArgs('id').and.returnValue('selectedItemsRect');
    const selectionParam = 'selectionParameters';

    const mockOffsetX = 271;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const yClickPos = 4;
    service[selectionParam].yClickPosition = yClickPos;
    service[selectionParam].xClickPosition = 1;
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    const spyClear = spyOn(service[selectionParam].selectedItems, 'clear');
    service.mouseUp(event, mockCanvasSVG);

    expect(spyUpdateSelectedItemsBox).not.toHaveBeenCalled();
    expect(spyClear).not.toHaveBeenCalled();
  });

  it('should  not return', () => {
    const event = new MouseEvent('mouseup');
    const mockParentSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockTargetSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockCanvasSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    spyOnProperty(event, 'target').and.returnValue(mockTargetSVG);
    Object.defineProperty(event.target, 'parentNode', { value: mockParentSVG});
    mockParentSVG.getAttribute.withArgs('id').and.returnValue('selectedItemsRound');
    const selectionParam = 'selectionParameters';

    const mockOffsetX = 271;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const yClickPos = 4;
    service[selectionParam].yClickPosition = yClickPos;
    service[selectionParam].xClickPosition = 1;
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    service.mouseUp(event, mockCanvasSVG);

    expect(spyUpdateSelectedItemsBox).not.toHaveBeenCalled();
  });

  it('should  remove selecteditemrect from canvas', () => {
    const event = new MouseEvent('mouseup');
    const mockParentSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockTargetSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockCanvasSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    spyOnProperty(event, 'target').and.returnValue(mockTargetSVG);
    Object.defineProperty(event.target, 'parentNode', { value: mockParentSVG});
    Object.defineProperty(mockParentSVG, 'nodeName', {value: 'g'});
    const selectionParam = 'selectionParameters';
    const rendererStr = 'renderer';
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service[selectionParam].selectedItemsRect = mockSelectedItemsRect;

    const mockOffsetX = 271;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const yClickPos = 4;
    service[selectionParam].yClickPosition = yClickPos;
    service[selectionParam].xClickPosition = 1;
    service.mouseUp(event, mockCanvasSVG);
    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockCanvasSVG, mockSelectedItemsRect);
  });

  it('should not modify selection.object', () => {
    const event = new MouseEvent('mouseup');
    const mockParentSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockTargetSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockCanvasSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    spyOnProperty(event, 'target').and.returnValue(mockTargetSVG);
    Object.defineProperty(event.target, 'parentNode', { value: mockCanvasSVG});
    Object.defineProperty(mockParentSVG, 'nodeName', {value: 'h'});
    const selectionParam = 'selectionParameters';
    const rendererStr = 'renderer';
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service[selectionParam].selectedItemsRect = mockSelectedItemsRect;

    const mockOffsetX = 271;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const yClickPos = 4;
    service[selectionParam].yClickPosition = yClickPos;
    service[selectionParam].xClickPosition = 1;
    service.mouseUp(event, mockCanvasSVG);
    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockCanvasSVG, mockSelectedItemsRect);
  });

  it('should set id', () => {
    const event = new MouseEvent('mouseup');
    const mockParentSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockTargetSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockCanvasSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    spyOnProperty(event, 'target').and.returnValue(mockTargetSVG);
    Object.defineProperty(event.target, 'parentNode', { value: mockCanvasSVG});
    Object.defineProperty(mockParentSVG, 'nodeName', {value: 'g'});
    const selectionParam = 'selectionParameters';
    service[selectionParam].rightClick = true;
    const spySet = spyOn(service[selectionParam].selectedItems, 'set');

    const mockOffsetX = 271;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const yClickPos = 4;
    service[selectionParam].yClickPosition = yClickPos;
    service[selectionParam].xClickPosition = 1;
    service.mouseUp(event, mockCanvasSVG);
    expect(spySet).toHaveBeenCalled();

  });

  it('should call clear with leftClick', () => {
    const event = new MouseEvent('mouseup');
    const mockParentSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockTargetSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockCanvasSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);

    spyOnProperty(event, 'target').and.returnValue(mockTargetSVG);
    Object.defineProperty(event.target, 'parentNode', { value: mockCanvasSVG});
    Object.defineProperty(mockParentSVG, 'nodeName', {value: 'g'});
    const selectionParam = 'selectionParameters';
    service[selectionParam].leftClick = true;
    const spyClear = spyOn(service[selectionParam].selectedItems, 'clear');
    spyOn(service, 'updateSelectedItemsBox');
    spyOn(service, 'drawSelectedItemsRect');
    const mockOffsetX = 271;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const yClickPos = 4;
    service[selectionParam].yClickPosition = yClickPos;
    service[selectionParam].xClickPosition = 1;
    service.mouseUp(event, mockCanvasSVG);
    expect(spyClear).toHaveBeenCalled();
  });

  it('should call clear not on rightClick', () => {
    const event = new MouseEvent('mouseup');
    const mockParentSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockTargetSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockCanvasSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);

    spyOnProperty(event, 'target').and.returnValue(mockTargetSVG);
    Object.defineProperty(event.target, 'parentNode', { value: mockTargetSVG});
    Object.defineProperty(mockParentSVG, 'nodeName', {value: 'h'});
    const selectionParam = 'selectionParameters';
    service[selectionParam].rightClick = true;
    const spyClear = spyOn(service[selectionParam].selectedItems, 'clear');

    const mockOffsetX = 271;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const yClickPos = 4;
    service[selectionParam].yClickPosition = yClickPos;
    service[selectionParam].xClickPosition = 1;
    service.mouseUp(event, mockCanvasSVG);
    expect(spyClear).not.toHaveBeenCalled();
  });

  it('should remove child selected Items rect from canvas when no right click', () => {
    const event = new MouseEvent('mouseup');
    const mockParentSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockTargetSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockCanvasSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    spyOnProperty(event, 'target').and.returnValue(mockTargetSVG);
    Object.defineProperty(event.target, 'parentNode', { value: mockTargetSVG});
    Object.defineProperty(mockParentSVG, 'nodeName', {value: 'h'});
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const selectionParam = 'selectionParameters';
    service[selectionParam].selectedItemsRect = mockSelectedItemsRect;
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service[selectionParam].selectedItemsRect = mockSVGElement;
    service[selectionParam].rightClick = false;
    const rendererStr = 'renderer';
    const spyClear = spyOn(service[selectionParam].selectedItems, 'clear');
    const mockOffsetX = 271;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const yClickPos = 4;
    service[selectionParam].yClickPosition = yClickPos;
    service[selectionParam].xClickPosition = 1;
    service.mouseUp(event, mockCanvasSVG);
    expect(service[rendererStr].removeChild).not.toHaveBeenCalledWith(mockCanvasSVG, mockSelectedItemsRect);
    expect(spyClear).toHaveBeenCalled();
  });

  // findMatrixValue
  it('should return old translation when no transform', () => {
    const mockElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const result = service.findMatrixValues(mockElement);
    const mockOldTranslation = new Map<string, string>();
    mockOldTranslation.set('xTranslation', '')
                      .set('yTranslation', '')
                      .set('dRotation', '')
                      .set('xRotation', '')
                      .set('yRotation', '');
    expect(result).toEqual(mockOldTranslation);
  });

  it('should return old translation when transform', () => {
    const mockElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    mockElement.getAttribute.withArgs('transform').and.returnValue('translate(0,0) rotate(0,0,0)');
    const oldTranslation = service.findMatrixValues(mockElement);
    expect(oldTranslation.get('xTranslation')).toBe('0');
    expect(oldTranslation.get('yTranslation')).toBe('0');
    expect(oldTranslation.get('dRotation')).toBe('0');
    expect(oldTranslation.get('xRotation')).toBe('0');
    expect(oldTranslation.get('yRotation')).toBe('0');
  });

  // selectDragDrop
  it('should set selected items ', () => {
    const selectionParam = 'selectionParameters';
    service[selectionParam].selectedItems = new Map();
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockChildrenSVG: jasmine.SpyObj<HTMLCollection> = jasmine.createSpyObj('SVGElement', ['item', 'getAttribute']);
    const mockSelectionRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    const mockChildSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    Object.defineProperty(mockSVG, 'children', { value: mockChildrenSVG});
    Object.defineProperty(mockChildrenSVG, 'length', { value: 1});
    mockChildSVG.getAttribute.withArgs('id').and.returnValue('1');
    mockChildrenSVG.item.and.returnValue(mockChildSVG);
    service[selectionParam].selectionRect = mockSelectionRect;

    spyOn(service, 'returnIfObject').and.returnValue(true);

    const mockElementBoundingBox = new DOMRect();
    const boundingLeft = 300;
    const boundingRight = 800;
    const boundingTop = 300;
    const boundingBottom = 800;
    spyOnProperty(mockElementBoundingBox, 'left').and.returnValue(boundingLeft);
    spyOnProperty(mockElementBoundingBox, 'right').and.returnValue(boundingRight);
    spyOnProperty(mockElementBoundingBox, 'top').and.returnValue(boundingTop);
    spyOnProperty(mockElementBoundingBox, 'bottom').and.returnValue(boundingBottom);

    const mockSelectionBoundingBox = new DOMRect();
    const left = 400;
    const right = 700;
    const top = 400;
    const bottom = 700;
    spyOnProperty(mockSelectionBoundingBox, 'left').and.returnValue(left);
    spyOnProperty(mockSelectionBoundingBox, 'right').and.returnValue(right);
    spyOnProperty(mockSelectionBoundingBox, 'top').and.returnValue(top);
    spyOnProperty(mockSelectionBoundingBox, 'bottom').and.returnValue(bottom);

    mockChildSVG.getBoundingClientRect.and.returnValue(mockElementBoundingBox);
    mockSelectionRect.getBoundingClientRect.and.returnValue(mockSelectionBoundingBox);
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');

    service.selectDragDrop(mockSVG);

    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(service[selectionParam].selectedItems.has('1')).toBe(true);
  });

  it('should call updateSelectedItemBox ', () => {
    const selectionParam = 'selectionParameters';
    service[selectionParam].selectedItems = new Map();
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockChildrenSVG: jasmine.SpyObj<HTMLCollection> = jasmine.createSpyObj('SVGElement', ['item', 'getAttribute']);
    const mockSelectionRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    const mockChildSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    Object.defineProperty(mockSVG, 'children', { value: mockChildrenSVG});
    Object.defineProperty(mockChildrenSVG, 'length', { value: 1});
    mockChildSVG.getAttribute.withArgs('id').and.returnValue('1');
    mockChildrenSVG.item.and.returnValue(mockChildSVG);
    service[selectionParam].selectionRect = mockSelectionRect;

    spyOn(service, 'returnIfObject').and.returnValue(false);

    const mockSelectionBoundingBox = new DOMRect();
    const left = 400;
    const right = 700;
    const top = 400;
    const bottom = 700;
    spyOnProperty(mockSelectionBoundingBox, 'left').and.returnValue(left);
    spyOnProperty(mockSelectionBoundingBox, 'right').and.returnValue(right);
    spyOnProperty(mockSelectionBoundingBox, 'top').and.returnValue(top);
    spyOnProperty(mockSelectionBoundingBox, 'bottom').and.returnValue(bottom);

    mockSelectionRect.getBoundingClientRect.and.returnValue(mockSelectionBoundingBox);
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    const spyDelete = spyOn(service[selectionParam].tempSelectedItems, 'delete');
    const spySet = spyOn(service[selectionParam].tempSelectedItems, 'set');

    service.selectDragDrop(mockSVG);

    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDelete).not.toHaveBeenCalled();
    expect(spySet).not.toHaveBeenCalled();

  });
  // InvertSelectDragDrop

  it('should call updateSelectedItemsBox() on ivertSelectDragDrop', () => {
    const selectionParam = 'selectionParameters';
    service[selectionParam].selectedItems = new Map();
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockChildrenSVG: jasmine.SpyObj<HTMLCollection> = jasmine.createSpyObj('SVGElement', ['item', 'getAttribute']);
    const mockSelectionRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    const mockChildSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    Object.defineProperty(mockSVG, 'children', { value: mockChildrenSVG});
    Object.defineProperty(mockChildrenSVG, 'length', { value: 1});
    mockChildSVG.getAttribute.withArgs('id').and.returnValue('1');
    mockChildrenSVG.item.and.returnValue(mockChildSVG);
    service[selectionParam].selectionRect = mockSelectionRect;

    spyOn(service, 'returnIfObject').and.returnValue(false);

    const mockSelectionBoundingBox = new DOMRect();
    const left = 400;
    const right = 700;
    const top = 400;
    const bottom = 700;
    spyOnProperty(mockSelectionBoundingBox, 'left').and.returnValue(left);
    spyOnProperty(mockSelectionBoundingBox, 'right').and.returnValue(right);
    spyOnProperty(mockSelectionBoundingBox, 'top').and.returnValue(top);
    spyOnProperty(mockSelectionBoundingBox, 'bottom').and.returnValue(bottom);

    mockSelectionRect.getBoundingClientRect.and.returnValue(mockSelectionBoundingBox);
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    const spyDelete = spyOn(service[selectionParam].tempSelectedItems, 'delete');
    const spySet = spyOn(service[selectionParam].tempSelectedItems, 'set');

    service.invertSelectDragDrop(mockSVG);

    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDelete).not.toHaveBeenCalled();
    expect(spySet).not.toHaveBeenCalled();
  });

  it('should set temp selected item - set', () => {
    const selectionParam = 'selectionParameters';
    service[selectionParam].selectedItems = new Map();
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockChildrenSVG: jasmine.SpyObj<HTMLCollection> = jasmine.createSpyObj('SVGElement', ['item', 'getAttribute']);
    const mockSelectionRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    const mockChildSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    Object.defineProperty(mockSVG, 'children', { value: mockChildrenSVG});
    Object.defineProperty(mockChildrenSVG, 'length', { value: 1});
    mockChildSVG.getAttribute.withArgs('id').and.returnValue('1');
    mockChildrenSVG.item.and.returnValue(mockChildSVG);
    service[selectionParam].selectionRect = mockSelectionRect;

    spyOn(service, 'returnIfObject').and.returnValue(true);

    const mockElementBoundingBox = new DOMRect();
    const boundingLeft = 300;
    const boundingRight = 800;
    const boundingTop = 300;
    const boundingBottom = 800;
    spyOnProperty(mockElementBoundingBox, 'left').and.returnValue(boundingLeft);
    spyOnProperty(mockElementBoundingBox, 'right').and.returnValue(boundingRight);
    spyOnProperty(mockElementBoundingBox, 'top').and.returnValue(boundingTop);
    spyOnProperty(mockElementBoundingBox, 'bottom').and.returnValue(boundingBottom);

    const mockSelectionBoundingBox = new DOMRect();
    const left = 400;
    const right = 700;
    const top = 400;
    const bottom = 700;
    spyOnProperty(mockSelectionBoundingBox, 'left').and.returnValue(left);
    spyOnProperty(mockSelectionBoundingBox, 'right').and.returnValue(right);
    spyOnProperty(mockSelectionBoundingBox, 'top').and.returnValue(top);
    spyOnProperty(mockSelectionBoundingBox, 'bottom').and.returnValue(bottom);

    mockChildSVG.getBoundingClientRect.and.returnValue(mockElementBoundingBox);
    mockSelectionRect.getBoundingClientRect.and.returnValue(mockSelectionBoundingBox);
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');

    service.invertSelectDragDrop(mockSVG);

    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(service[selectionParam].tempSelectedItems.has('1')).toBe(true);

  });

  it('should set temp selected item - delete', () => {
    const selectionParam = 'selectionParameters';
    service[selectionParam].selectedItems = new Map<string, SVGElement>();
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockChildrenSVG: jasmine.SpyObj<HTMLCollection> = jasmine.createSpyObj('SVGElement', ['item', 'getAttribute']);
    const mockSelectionRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    const mockChildSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    Object.defineProperty(mockSVG, 'children', { value: mockChildrenSVG});
    Object.defineProperty(mockChildrenSVG, 'length', { value: 1});
    mockChildSVG.getAttribute.withArgs('id').and.returnValue('1');
    mockChildrenSVG.item.and.returnValue(mockChildSVG);
    service[selectionParam].selectionRect = mockSelectionRect;

    spyOn(service, 'returnIfObject').and.returnValue(true);
    service[selectionParam].selectedItems.set('1', mockChildSVG);

    const mockElementBoundingBox = new DOMRect();
    const boundingLeft = 300;
    const boundingRight = 800;
    const boundingTop = 300;
    const boundingBottom = 800;
    spyOnProperty(mockElementBoundingBox, 'left').and.returnValue(boundingLeft);
    spyOnProperty(mockElementBoundingBox, 'right').and.returnValue(boundingRight);
    spyOnProperty(mockElementBoundingBox, 'top').and.returnValue(boundingTop);
    spyOnProperty(mockElementBoundingBox, 'bottom').and.returnValue(boundingBottom);

    const mockSelectionBoundingBox = new DOMRect();
    const left = 400;
    const right = 700;
    const top = 400;
    const bottom = 700;
    spyOnProperty(mockSelectionBoundingBox, 'left').and.returnValue(left);
    spyOnProperty(mockSelectionBoundingBox, 'right').and.returnValue(right);
    spyOnProperty(mockSelectionBoundingBox, 'top').and.returnValue(top);
    spyOnProperty(mockSelectionBoundingBox, 'bottom').and.returnValue(bottom);

    mockChildSVG.getBoundingClientRect.and.returnValue(mockElementBoundingBox);
    mockSelectionRect.getBoundingClientRect.and.returnValue(mockSelectionBoundingBox);
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');

    service.invertSelectDragDrop(mockSVG);

    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(service[selectionParam].tempSelectedItems.has('1')).toBe(false);

  });

  // setAttributesSelectedItemsRect
  it('should set selected items rectangle attributes to the right values', () => {
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockID = 'selectedItemsRectangle';
    const mockX = 2;
    const mockY = 2;
    const mockHeight = 2;
    const mockWidth = 2;
    const mockFill = 'none';
    const rendererStr = 'renderer';
    service.setAttributesSelectedItemsRect(mockSVG, mockID, mockX, mockY, mockHeight, mockWidth, mockFill);

    const haveBeenCalledTimes = 8;
    expect(service[rendererStr].setAttribute).toHaveBeenCalledTimes(haveBeenCalledTimes);
  });

  // calculateRectangleDimension()
  it('should set selectinRectWidth to xLeftDragDrop and height to yTop', () => {
    const event = new MouseEvent('mousemove');
    const selectionParam = 'selectionParameters';
    const mockOffsetX = 10;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const xLeftDragDropValue = 9;
    const yTopDragDropValue = 4;
    service[selectionParam].xLeftDragDrop = xLeftDragDropValue;
    service[selectionParam].yTopDragDrop = yTopDragDropValue;
    service.calculateRectangleDimensions(event);
    expect(service[selectionParam].selectionRectWidth).toEqual(xLeftDragDropValue);
    expect(service[selectionParam].selectionRectHeight).toEqual(yTopDragDropValue);
  });

  it('should set width and height to right values ', () => {
    const event = new MouseEvent('mousemove');
    const selectionParam = 'selectionParameters';
    const mockOffsetX = 10;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const xLeftDragDropValue = 11;
    const yTopDragDropValue = 14;
    service[selectionParam].xLeftDragDrop = xLeftDragDropValue;
    service[selectionParam].yTopDragDrop = yTopDragDropValue;
    service.calculateRectangleDimensions(event);
    expect(service[selectionParam].selectionRectWidth).toEqual(mockOffsetX);
    expect(service[selectionParam].selectionRectHeight).toEqual(mockOffsetY);
  });

  it('should set selectionRect Attributes ', () => {
    const event = new MouseEvent('mousemove');
    const selectionParam = 'selectionParameters';
    const rendererStr = 'renderer';
    const mockOffsetX = 10;
    const mockOffsetY = 5;
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    const xLeftDragDropValue = 11;
    const yTopDragDropValue = 14;
    service[selectionParam].xLeftDragDrop = xLeftDragDropValue;
    service[selectionParam].yTopDragDrop = yTopDragDropValue;
    const width = 10;
    const height = 10;
    service[selectionParam].selectionRectWidth = width;
    service[selectionParam].selectionRectHeight = height;
    service.calculateRectangleDimensions(event);
    const nbTimesCalled = 4;
    expect(service[rendererStr].setAttribute).toHaveBeenCalledTimes(nbTimesCalled);
    expect(service[rendererStr].setAttribute).toHaveBeenCalledWith(service[selectionParam].selectionRect, SELECTION.X, '10');
    expect(service[rendererStr].setAttribute).toHaveBeenCalledWith(service[selectionParam].selectionRect, SELECTION.Y, '5');
    expect(service[rendererStr].setAttribute).toHaveBeenCalledWith(service[selectionParam].selectionRect, SELECTION.HEIGHT, '9');
    expect(service[rendererStr].setAttribute).toHaveBeenCalledWith(service[selectionParam].selectionRect, SELECTION.WIDTH, '1');
  });

  // Draw selection rectangle
  it('should set selectionRect Attributes on drawSelectionRect', () => {
    const event = new MouseEvent('mousemove');
    const selectionParam = 'selectionParameters';
    const rendererStr = 'renderer';
    const parent = document.createElement('svg');
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    spyOnProperty(event, 'target').and.returnValue(parent);

    const spyCalculateRectangleDimensions = spyOn(service, 'calculateRectangleDimensions');
    service.drawSelectionRectangle(mockSVG, event);
    const nbTimesCalled = 5;
    expect(service[rendererStr].setAttribute).toHaveBeenCalledTimes(nbTimesCalled);
    expect(spyCalculateRectangleDimensions).toHaveBeenCalledWith(event);
    expect(service[rendererStr].setAttribute).toHaveBeenCalledWith(service[selectionParam].selectionRect, SELECTION.STROKE_WIDTH, '1');
    expect(service[rendererStr].setAttribute).toHaveBeenCalledWith(service[selectionParam].selectionRect, SELECTION.STROKE, 'black');
    expect(service[rendererStr].setAttribute).toHaveBeenCalledWith(service[selectionParam].selectionRect, SELECTION.FILL, 'none');
    expect(service[rendererStr].setAttribute).toHaveBeenCalledWith(service[selectionParam].selectionRect, 'stroke-dasharray', '4, 1');
    expect(service[rendererStr].setAttribute).toHaveBeenCalledWith(service[selectionParam].selectionRect, 'id', 'selectionRect');
  });
  // keyboardTransformation
  it('should apply keyboard transformation correclty when selected items rect exists and only arrowLeft = true', () => {
    const spyTimeout = spyOn(global, 'setTimeout');
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    const rendererStr = 'renderer';
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const selectionParam = 'selectionParameters';
    service[selectionParam].selectedItemsRect = mockSelectedItemsRect;
    const hotkeysStr = 'hotkeys';
    service[hotkeysStr].set('ArrowLeft', true);
    service[hotkeysStr].set('ArrowRight', false);
    service[hotkeysStr].set('ArrowUp', false);
    service[hotkeysStr].set('ArrowDown', false);
    service.keyboardTransformation(mockCanvas);

    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockCanvas, mockSelectedItemsRect);
    expect(spyTimeout).toHaveBeenCalledTimes(1);
    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDrawSelectedItemsRect).toHaveBeenCalledWith(mockCanvas);
  });

  it('should apply keyboard transformation correclty when selected items rect does not exist and only arrowRight = true', () => {
    const spyTimeout = spyOn(global, 'setTimeout');
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    const rendererStr = 'renderer';
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const hotkeysStr = 'hotkeys';
    service[hotkeysStr].set('ArrowLeft', false);
    service[hotkeysStr].set('ArrowRight', true);
    service[hotkeysStr].set('ArrowUp', false);
    service[hotkeysStr].set('ArrowDown', false);
    service.keyboardTransformation(mockCanvas);

    expect(service[rendererStr].removeChild).not.toHaveBeenCalled();
    expect(spyTimeout).toHaveBeenCalledTimes(1);
    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDrawSelectedItemsRect).toHaveBeenCalledWith(mockCanvas);
  });

  it('should apply keyboard transformation correclty when selected items rect exists and only arrowUp = true', () => {
    const spyTimeout = spyOn(global, 'setTimeout');
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    const rendererStr = 'renderer';
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const selectionParam = 'selectionParameters';
    service[selectionParam].selectedItemsRect = mockSelectedItemsRect;
    const hotkeysStr = 'hotkeys';
    service[hotkeysStr].set('ArrowLeft', false);
    service[hotkeysStr].set('ArrowRight', false);
    service[hotkeysStr].set('ArrowUp', true);
    service[hotkeysStr].set('ArrowDown', false);
    service.keyboardTransformation(mockCanvas);

    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockCanvas, mockSelectedItemsRect);
    expect(spyTimeout).toHaveBeenCalledTimes(1);
    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDrawSelectedItemsRect).toHaveBeenCalledWith(mockCanvas);
  });

  it('should apply keyboard transformation correclty when selected items rect exists and only arrowDown = true', () => {
    const spyTimeout = spyOn(global, 'setTimeout');
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    const rendererStr = 'renderer';
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const selectionParam = 'selectionParameters';
    service[selectionParam].selectedItemsRect = mockSelectedItemsRect;
    const hotkeysStr = 'hotkeys';
    service[hotkeysStr].set('ArrowLeft', false);
    service[hotkeysStr].set('ArrowRight', false);
    service[hotkeysStr].set('ArrowUp', false);
    service[hotkeysStr].set('ArrowDown', true);
    service.keyboardTransformation(mockCanvas);

    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockCanvas, mockSelectedItemsRect);
    expect(spyTimeout).toHaveBeenCalledTimes(1);
    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDrawSelectedItemsRect).toHaveBeenCalledWith(mockCanvas);
  });

  // drawSelectedItemsRect
  it('should not draw selectedItemsRect correctly', () => {
    const selectionParam = 'selectionParameters';
    service[selectionParam].areItemsSelected = false;
    const rendererStr = 'renderer';
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service.drawSelectedItemsRect(mockCanvas);
    expect(service[rendererStr].createElement).not.toHaveBeenCalled();
  });

  it('should draw selectedItemsRect correctly', () => {
    const rendererStr = 'renderer';
    const selectionParam = 'selectionParameters';
    service[selectionParam].areItemsSelected = true;

    const spySetControlPointsCoordinates = spyOn(service, 'setControlPointsCoordinates').and.returnValue(new Map());
    const spySetAttributesSelectedItemsRect = spyOn(service, 'setAttributesSelectedItemsRect');

    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service.drawSelectedItemsRect(mockCanvas);
    const nbTimesCreateCalled = 6;
    expect(service[rendererStr].createElement).toHaveBeenCalledTimes(nbTimesCreateCalled);
    expect(service[rendererStr].createElement).toHaveBeenCalledWith('g', SELECTION.LINK);
    expect(service[rendererStr].createElement).toHaveBeenCalledWith(SELECTION.RECT, SELECTION.LINK);
    expect(service[rendererStr].setAttribute).toHaveBeenCalled();
    expect(spySetControlPointsCoordinates).toHaveBeenCalled();
    const nbTimesSetAttCalled = 5;
    const nbTimesAppendCalled = 6;
    expect(spySetAttributesSelectedItemsRect).toHaveBeenCalledTimes(nbTimesSetAttCalled);
    expect(service[rendererStr].appendChild).toHaveBeenCalledTimes(nbTimesAppendCalled);
  });

  // updateSelectedItemsBox
  it('should update selection correctly when drag and drop, right click and no items selected', () => {
    const selectionParam = 'selectionParameters';
    service[selectionParam].dragDrop = true;
    service[selectionParam].rightClick = true;
    spyOnProperty(service[selectionParam].tempSelectedItems, 'size').and.returnValue(0);
    spyOnProperty(service[selectionParam].selectedItems, 'size').and.returnValue(0);
    service.updateSelectedItemsBox();
    expect(service[selectionParam].areItemsSelected).toBe(false);
  });

  it('should update selection correctly when drag and drop, right click and items selected', () => {
    const selectionParam = 'selectionParameters';
    service[selectionParam].dragDrop = true;
    service[selectionParam].rightClick = true;
    spyOnProperty(service[selectionParam].tempSelectedItems, 'size').and.returnValue(1);
    spyOnProperty(service[selectionParam].selectedItems, 'size').and.returnValue(0);
    const spyUpdateDimensions = spyOn(service, 'updateDimensions');
    const mockSelectedItems: jasmine.SpyObj<Map<string, SVGElement>> = jasmine.createSpyObj('Map<number, any>', ['']);
    service[selectionParam].tempSelectedItems = mockSelectedItems;
    service.updateSelectedItemsBox();
    expect(service[selectionParam].areItemsSelected).toBe(true);
    expect(spyUpdateDimensions).toHaveBeenCalledWith(mockSelectedItems);
  });

  it('should update selection correctly when no drag and drop or no right click and no items selected', () => {
    const selectionParam = 'selectionParameters';
    service[selectionParam].dragDrop = true;
    service[selectionParam].rightClick = false;
    spyOnProperty(service[selectionParam].selectedItems, 'size').and.returnValue(0);
    service.updateSelectedItemsBox();
    expect(service[selectionParam].areItemsSelected).toBe(false);
  });

  it('should update selection correctly when no drag and drop or no right click and items selected', () => {
    const selectionParam = 'selectionParameters';
    service[selectionParam].dragDrop = true;
    service[selectionParam].rightClick = false;
    spyOnProperty(service[selectionParam].selectedItems, 'size').and.returnValue(1);
    const spyUpdateDimensions = spyOn(service, 'updateDimensions');
    const mockSelectedItems: jasmine.SpyObj<Map<string, SVGElement>> = jasmine.createSpyObj('Map<number, any>', ['']);
    service[selectionParam].selectedItems = mockSelectedItems;
    service.updateSelectedItemsBox();
    expect(service[selectionParam].areItemsSelected).toBe(true);
    expect(spyUpdateDimensions).toHaveBeenCalledWith(mockSelectedItems);
  });

  // updateDimensions
  it('should update dimensions correctly when element widens selected items box on left edge', () => {
    const rendererStr = 'renderer';
    const selectionParam = 'selectionParameters';
    const mockItems = new Map<string, SVGElement>();
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    mockSVGElement.getAttribute.and.returnValue('2');
    const mockElementBoundingBox = new DOMRect();
    service[rendererStr].setAttribute(mockSVGElement, SELECTION.STROKE_WIDTH, '2');
    const leftSelect1 = 300;
    const rightSelect1 = 800;
    const topSelect1 = 300;
    const bottomSelect1 = 800;
    spyOnProperty(mockElementBoundingBox, 'left').and.returnValue(leftSelect1);
    spyOnProperty(mockElementBoundingBox, 'right').and.returnValue(rightSelect1);
    spyOnProperty(mockElementBoundingBox, 'top').and.returnValue(topSelect1);
    spyOnProperty(mockElementBoundingBox, 'bottom').and.returnValue(bottomSelect1);

    mockSVGElement.getBoundingClientRect.and.returnValue(mockElementBoundingBox);
    mockItems.set('1', mockSVGElement);
    const leftSelect = 400;
    const rightSelect = 450;
    const topSelect = 400;
    const bottomSelect = 450;
    service[selectionParam].leftSelectedItemsBox = leftSelect;
    service[selectionParam].rightSelectedItemsBox = rightSelect;
    service[selectionParam].topSelectedItemsBox = topSelect;
    service[selectionParam].bottomSelectedItemsBox = bottomSelect;
    service.updateDimensions(mockItems);
    const leftSelectValue = 270;
    const rightSelectValue = 268;
    expect(service[selectionParam].leftSelectedItemsBox).toBe(mockElementBoundingBox.left - leftSelectValue);
    expect(service[selectionParam].rightSelectedItemsBox).toBe(mockElementBoundingBox.right - rightSelectValue);
    expect(service[selectionParam].topSelectedItemsBox).toBe(mockElementBoundingBox.top - 1);
    expect(service[selectionParam].bottomSelectedItemsBox).toBe(mockElementBoundingBox.bottom + 1);
  });

  it('should not update dimensions correctly when element widens selected items box on left edge', () => {
    const rendererStr = 'renderer';
    const selectionParam = 'selectionParameters';
    const mockItems = new Map<string, SVGElement>();
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    mockSVGElement.getAttribute.and.returnValue('2');
    const mockElementBoundingBox = new DOMRect();
    service[rendererStr].setAttribute(mockSVGElement, SELECTION.STROKE_WIDTH, '2');
    const leftSelect1 = 1000;
    const rightSelect1 = 60;
    const topSelect1 = 900;
    const bottomSelect1 = 60;
    spyOnProperty(mockElementBoundingBox, 'left').and.returnValue(leftSelect1);
    spyOnProperty(mockElementBoundingBox, 'right').and.returnValue(rightSelect1);
    spyOnProperty(mockElementBoundingBox, 'top').and.returnValue(topSelect1);
    spyOnProperty(mockElementBoundingBox, 'bottom').and.returnValue(bottomSelect1);

    mockSVGElement.getBoundingClientRect.and.returnValue(mockElementBoundingBox);
    mockItems.set('1', mockSVGElement);
    const leftSelect = 730;
    const rightSelect = -208;
    const topSelect = 899;
    const bottomSelect = 1801;
    service[selectionParam].leftSelectedItemsBox = leftSelect;
    service[selectionParam].rightSelectedItemsBox = rightSelect;
    service[selectionParam].topSelectedItemsBox = topSelect;
    service[selectionParam].bottomSelectedItemsBox = bottomSelect;
    service.updateDimensions(mockItems);

    expect(service[selectionParam].leftSelectedItemsBox).toBe(leftSelect);
    expect(service[selectionParam].rightSelectedItemsBox).toBe(rightSelect);
    expect(service[selectionParam].topSelectedItemsBox).toBe(topSelect);
    expect(service[selectionParam].bottomSelectedItemsBox).toBe(bottomSelect);
  });

  // rectSelectionDragDrop
  it('should draw selection rectangle and update selected items rectangle correctly when right click', () => {
    const rendererStr = 'renderer';
    const selectionParam = 'selectionParameters';
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSelectionRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service[selectionParam].selectedItemsRect = mockSelectedItemsRect;
    service[selectionParam].selectionRect = mockSelectionRect;
    const mockEvent = new MouseEvent('mousemove');
    service[selectionParam].rightClick = true;
    service[selectionParam].leftClick = false;

    const spyDrawSelectionRectangle = spyOn(service, 'drawSelectionRectangle');
    const spyInvertSelectDragDrop = spyOn(service, 'invertSelectDragDrop');
    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    service.rectSelectionDragDrop(mockCanvas, mockEvent);

    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockCanvas, mockSelectedItemsRect);
    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockCanvas, mockSelectionRect);
    expect(spyDrawSelectionRectangle).toHaveBeenCalledWith(mockCanvas, mockEvent);
    expect(spyInvertSelectDragDrop).toHaveBeenCalledWith(mockCanvas);
    expect(spyDrawSelectedItemsRect).toHaveBeenCalledWith(mockCanvas);
  });

  it('should draw selection rectangle and update selected items rectangle correctly when left click', () => {
    const rendererStr = 'renderer';
    const selectionParam = 'selectionParameters';
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSelectionRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service[selectionParam].selectedItemsRect = mockSelectedItemsRect;
    service[selectionParam].selectionRect = mockSelectionRect;
    const mockEvent = new MouseEvent('mousemove');
    service[selectionParam].rightClick = false;
    service[selectionParam].leftClick = true;

    const spyDrawSelectionRectangle = spyOn(service, 'drawSelectionRectangle');
    const spySelectDragDrop = spyOn(service, 'selectDragDrop');
    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    service.rectSelectionDragDrop(mockCanvas, mockEvent);

    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockCanvas, mockSelectedItemsRect);
    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockCanvas, mockSelectionRect);
    expect(spyDrawSelectionRectangle).toHaveBeenCalledWith(mockCanvas, mockEvent);
    expect(spySelectDragDrop).toHaveBeenCalledWith(mockCanvas);
    expect(spyDrawSelectedItemsRect).toHaveBeenCalledWith(mockCanvas);
  });

  it('should not draw when no click', () => {
    const selectionParam = 'selectionParameters';
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSelectionRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service[selectionParam].selectedItemsRect = mockSelectedItemsRect;
    service[selectionParam].selectionRect = mockSelectionRect;
    const mockEvent = new MouseEvent('mousemove');
    service[selectionParam].rightClick = false;
    service[selectionParam].leftClick = false;

    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    service.rectSelectionDragDrop(mockCanvas, mockEvent);

    expect(spyDrawSelectedItemsRect).toHaveBeenCalledWith(mockCanvas);
  });

  // isClickWithinSelectedItemsBox
  it('should return true if click is within selected items box', () => {
    const mockEvent = new MouseEvent('mousdown');
    const mockOffReturnValue = 500;
    spyOnProperty(mockEvent, 'offsetX').and.returnValue(mockOffReturnValue);
    spyOnProperty(mockEvent, 'offsetY').and.returnValue(mockOffReturnValue);

    const selectionParam = 'selectionParameters';
    const leftSelect = 400;
    const rightSelect = 600;
    const topSelect = 400;
    const bottomSelect = 600;
    service[selectionParam].leftSelectedItemsBox = leftSelect;
    service[selectionParam].rightSelectedItemsBox = rightSelect;
    service[selectionParam].topSelectedItemsBox = topSelect;
    service[selectionParam].bottomSelectedItemsBox = bottomSelect;

    expect(service.isClickWithinSelectedItemsBox(mockEvent)).toBe(true);
  });

  it('should return false if click is not within selected items box', () => {
    const mockEvent = new MouseEvent('mousdown');
    const mockOffReturnValue = 500;
    spyOnProperty(mockEvent, 'offsetX').and.returnValue(mockOffReturnValue);
    spyOnProperty(mockEvent, 'offsetY').and.returnValue(mockOffReturnValue);

    const selectionParam = 'selectionParameters';
    const leftSelect = 550;
    const rightSelect = 600;
    const topSelect = 400;
    const bottomSelect = 600;
    service[selectionParam].leftSelectedItemsBox = leftSelect;
    service[selectionParam].rightSelectedItemsBox = rightSelect;
    service[selectionParam].topSelectedItemsBox = topSelect;
    service[selectionParam].bottomSelectedItemsBox = bottomSelect;

    expect(service.isClickWithinSelectedItemsBox(mockEvent)).toBe(false);
  });

  // deplacement
  it('should translate svg object correctly', () => {
    const rendererStr = 'renderer';
    const mockXTranslation = 5;
    const mockYTranslation = 5;
    const selectionParam = 'selectionParameters';
    const mockItems = new Map<string, SVGElement>();
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    mockItems.set('1', mockSVGElement);
    service[selectionParam].selectedItems = mockItems;
    const spyFindMatrixValues = spyOn(service, 'findMatrixValues');
    const mockOldTranslation = new Map<string, string>();
    mockOldTranslation.set('xTranslation', '0')
                      .set('yTranslation', '0')
                      .set('dRotation', '0')
                      .set('xRotation', '0')
                      .set('yRotation', '0');
    spyFindMatrixValues.and.returnValue(mockOldTranslation);

    service.deplacement(mockXTranslation, mockYTranslation);

    expect(spyFindMatrixValues).toHaveBeenCalled();
    expect(service[rendererStr].setAttribute).toHaveBeenCalledWith(mockSVGElement, 'transform', 'translate(5,5) rotate(0,0,0)');
  });

  // mouseMove
  it('mouse move should respond correctly when translating and click on canvas or selected item', () => {
    const selectionParam = 'selectionParameters';
    const rendererStr = 'renderer';
    const mockEvent = new MouseEvent('mousemove');
    service[selectionParam].dragDrop = true;
    service[selectionParam].mouseMoveAction = 'translate';
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service[selectionParam].object = mockCanvas;

    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service[selectionParam].selectedItemsRect = mockSVGElement;
    const spyDeplacement = spyOn(service, 'deplacement');
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    const mockOffReturnValue = 500;
    spyOnProperty(mockEvent, 'offsetX').and.returnValue(mockOffReturnValue);
    spyOnProperty(mockEvent, 'offsetY').and.returnValue(mockOffReturnValue);

    service.mouseMove(mockEvent, mockCanvas);

    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockCanvas, mockSVGElement);
    expect(spyDeplacement).toHaveBeenCalled();
    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDrawSelectedItemsRect).toHaveBeenCalledWith(mockCanvas);
    expect(service[selectionParam].oldMouseMoveXPos).toBe(mockOffReturnValue);
    expect(service[selectionParam].oldMouseMoveYPos).toBe(mockOffReturnValue);
  });

  it('mouse move should respond correctly when translating and click not on canvas and not on selected item', () => {
    const selectionParam = 'selectionParameters';
    const rendererStr = 'renderer';
    const mockEvent = new MouseEvent('mousemove');
    service[selectionParam].dragDrop = true;
    service[selectionParam].mouseMoveAction = 'translate';
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSVGElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    service[rendererStr].setAttribute(mockSVGElement, 'id', '1');
    mockSVGElement.getAttribute.withArgs('id').and.returnValue('1');
    service[selectionParam].object = mockSVGElement;
    service[selectionParam].selectedItems = new Map<string, SVGElement>();

    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service[selectionParam].selectedItemsRect = mockSelectedItemsRect;
    const spyDeplacement = spyOn(service, 'deplacement');
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    const spyClear = spyOn(service[selectionParam].selectedItems, 'clear');
    const mockOffReturnValue = 500;
    spyOnProperty(mockEvent, 'offsetX').and.returnValue(mockOffReturnValue);
    spyOnProperty(mockEvent, 'offsetY').and.returnValue(mockOffReturnValue);

    service.mouseMove(mockEvent, mockCanvas);

    expect(service[rendererStr].removeChild).toHaveBeenCalledWith(mockCanvas, mockSelectedItemsRect);
    expect(spyClear).toHaveBeenCalled();
    expect(service[selectionParam].selectedItems.has('1')).toBe(true);
    expect(spyDeplacement).toHaveBeenCalled();
    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDrawSelectedItemsRect).toHaveBeenCalledWith(mockCanvas);
    expect(service[selectionParam].oldMouseMoveXPos).toBe(mockOffReturnValue);
    expect(service[selectionParam].oldMouseMoveYPos).toBe(mockOffReturnValue);
  });

  it('mouse move should respoind correctly when selecting', () => {
    const selectionParam = 'selectionParameters';
    const mockEvent = new MouseEvent('mousemove');
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const spy = spyOn(service, 'rectSelectionDragDrop');
    service[selectionParam].mouseMoveAction = 'selection';
    service[selectionParam].dragDrop = true;
    service.mouseMove(mockEvent, mockCanvas);
    expect(spy).toHaveBeenCalledWith(mockCanvas, mockEvent);
  });

  it('mouse move should not do anything when dragDrop = false', () => {
    const selectionParam = 'selectionParameters';
    const mockEvent = new MouseEvent('mousemove');
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service[selectionParam].dragDrop = false;
    const spyRectSelectionDragDrop = spyOn(service, 'rectSelectionDragDrop');
    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    service.mouseMove(mockEvent, mockCanvas);
    expect(spyRectSelectionDragDrop).not.toHaveBeenCalled();
    expect(spyDrawSelectedItemsRect).not.toHaveBeenCalled();
  });
  // setControlPointsCoordinate
  it('should set map value', () => {
    const map4 = 4;
    const mockMainRectWidth = 20;
    const mockMainRectHeight = 20;
    const selectionParam = 'selectionParameters';
    const mockMap = new Map<string, number>();
    service[selectionParam].topSelectedItemsBox = 2;
    const selectedItemsBox = 8;
    service[selectionParam].leftSelectedItemsBox = selectedItemsBox;

    mockMap.set('xLeft', service[selectionParam].leftSelectedItemsBox - map4)
          .set('yLeft', service[selectionParam].topSelectedItemsBox + (mockMainRectHeight / 2) - map4)
          .set('xRight', service[selectionParam].leftSelectedItemsBox + mockMainRectWidth - map4)
           .set('yRight', service[selectionParam].topSelectedItemsBox + (mockMainRectHeight / 2) - map4)
           .set('xTop', service[selectionParam].leftSelectedItemsBox + (mockMainRectWidth / 2) - map4)
           .set('yTop', service[selectionParam].topSelectedItemsBox - map4)
           .set('xBottom', service[selectionParam].leftSelectedItemsBox + (mockMainRectWidth / 2) - map4)
           .set('yBottom', service[selectionParam].topSelectedItemsBox + mockMainRectHeight - map4);
    service.setControlPointsCoordinates(mockMainRectHeight, mockMainRectWidth);
    expect(service.setControlPointsCoordinates(mockMainRectHeight, mockMainRectWidth)).toEqual(mockMap);

  });

   // selectAll
  it('should set selected Item ID ', () => {
   const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
   const mockChildrenSVG: jasmine.SpyObj<HTMLCollection> = jasmine.createSpyObj('SVGElement', ['item', 'getAttribute']);
   const mockChild: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
   Object.defineProperty(mockSVG, 'children', { value: mockChildrenSVG});
   Object.defineProperty(mockChildrenSVG, 'length', { value: 1});
   mockChild.getAttribute.withArgs('id').and.returnValue('1');
   mockChildrenSVG.item.and.returnValue(mockChild);
   const selectionParam = 'selectionParameters';

   spyOn(service, 'returnIfObject').and.returnValue(true);
   const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
   const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
   const spyClear = spyOn(service[selectionParam].selectedItems, 'clear');

   service.selectAllItems(mockSVG);

   expect(service[selectionParam].selectedItems.has('1')).toBe(true);
   expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
   expect(spyDrawSelectedItemsRect).toHaveBeenCalled();
   expect(spyClear).toHaveBeenCalled();
  });

  it('should call this.updateSelectedItemsBox() and this.drawSelectedItemsRect(canvas)', () => {
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockChildSVG: jasmine.SpyObj<HTMLCollection> = jasmine.createSpyObj('SVGElement', ['item', 'getAttribute']);
    const mockSelectionRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    Object.defineProperty(mockSVG, 'children', { value: mockChildSVG});
    Object.defineProperty(mockChildSVG, 'length', { value: 6});
    mockChildSVG.item.and.returnValue(mockSelectionRect);
    const selectionParam = 'selectionParameters';
    service[selectionParam].selectionRect = mockSelectionRect;
    spyOn(service, 'returnIfObject').and.returnValue(false);
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    service[selectionParam].selectedItemsRect = mockSelectedItemsRect;
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    const spyClear = spyOn(service[selectionParam].selectedItems, 'clear');

    service.selectAllItems(mockSVG);

    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDrawSelectedItemsRect).toHaveBeenCalled();
    expect(service[selectionParam].selectedItems.has('1')).toBe(false);
    expect(spyClear).toHaveBeenCalled();
   });

   // returnIfObject
  it('should return true if object', () => {
    const selectionParams = 'selectionParameters';
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    mockSVG.getAttribute.withArgs('id').and.returnValue('1');
    service[selectionParams].object = mockSVG;
    const result = service.returnIfObject();
    expect(result).toBe(true);
   });

   // updateForClipboard
  it('should update for clipboard when del', () => {
    const renderer = 'renderer';
    const spy = spyOn(service, 'updateSelectedItemsBox');
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockDel = true;
    service.updateForClipboard(mockCanvas, mockDel);
    expect(service[renderer].removeChild).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should update for clipboard when not del', () => {
    const renderer = 'renderer';
    const selectionParam = 'selectionParameters';
    const spyUpdateSelectedItemsBox = spyOn(service, 'updateSelectedItemsBox');
    const spyDrawSelectedItemsRect = spyOn(service, 'drawSelectedItemsRect');
    const mockCanvas: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockDel = false;
    const mockTopSelectedItemsBox = 300;
    const mockBottomSelectedItemsBox = 500;
    const mockLeftSelectedItemsBox = 300;
    const mockRightSelectedItemsBox = 500;
    service[selectionParam].topSelectedItemsBox = mockTopSelectedItemsBox;
    service[selectionParam].bottomSelectedItemsBox = mockBottomSelectedItemsBox;
    service[selectionParam].leftSelectedItemsBox = mockLeftSelectedItemsBox;
    service[selectionParam].rightSelectedItemsBox = mockRightSelectedItemsBox;
    const spyCalculateRotationAxis = spyOn(service, 'calculateRotationAxis');
    const mockSelectedItemsBoxRotationAxis = new Map<string, string>();

    service.updateForClipboard(mockCanvas, mockDel);
    expect(service[renderer].removeChild).toHaveBeenCalled();
    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDrawSelectedItemsRect).toHaveBeenCalledWith(mockCanvas);
    expect(spyCalculateRotationAxis).toHaveBeenCalledWith(mockTopSelectedItemsBox, mockBottomSelectedItemsBox,
      mockLeftSelectedItemsBox, mockRightSelectedItemsBox, mockSelectedItemsBoxRotationAxis);
  });

  it('should update selected items rotation axis and init position', () => {
    const selectionParam = 'selectionParameters';
    const mockItems = new Map<string, SVGElement>();
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    const mockElementBoundingBox = new DOMRect();
    const left = 400;
    const right = 450;
    const top = 400;
    const bottom = 450;
    spyOnProperty(mockElementBoundingBox, 'left').and.returnValue(left);
    spyOnProperty(mockElementBoundingBox, 'right').and.returnValue(right);
    spyOnProperty(mockElementBoundingBox, 'top').and.returnValue(top);
    spyOnProperty(mockElementBoundingBox, 'bottom').and.returnValue(bottom);
    mockSVG.getBoundingClientRect.and.returnValue(mockElementBoundingBox);
    mockItems.set('1', mockSVG);
    service[selectionParam].selectedItems = mockItems;
    const spyClear1 = spyOn(service[selectionParam].selectedItemsInitPosBeforeRotation, 'clear');
    const spyClear2 = spyOn(service[selectionParam].selectedItemsRotationAxis, 'clear');
    service.updateSelectedItemsRotationAxisAndInitPos();

    expect(spyClear1).toHaveBeenCalled();
    expect(spyClear2).toHaveBeenCalled();
    expect(service[selectionParam].selectedItemsInitPosBeforeRotation.has('1'));
    expect(service[selectionParam].selectedItemsRotationAxis.has('1'));
  });

// Garder tests ensemble
// tslint:disable-next-line: max-file-line-count
});

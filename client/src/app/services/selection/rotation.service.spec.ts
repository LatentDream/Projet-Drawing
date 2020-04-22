import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RotationService } from './rotation.service';
import { SelectionService } from './selection.service';

describe('RotationService', () => {
  let rotationService: RotationService;
  let selectionService: SelectionService;
  let mockRenderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2]
    });
    rotationService = TestBed.get(RotationService);
    selectionService = TestBed.get(SelectionService);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'setAttribute', 'removeChild', 'createElement']);
    const rendererStr = 'renderer';
    rotationService[rendererStr] = mockRenderer;
  });

  it('should be created', () => {
    expect(rotationService).toBeTruthy();
  });

  it('should update selected items init position before rotation correctly', () => {
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
    selectionService[selectionParam].selectedItems = mockItems;
    const spyClear = spyOn(selectionService[selectionParam].selectedItemsInitPosBeforeRotation, 'clear');
    rotationService.updateSelectedItemsInitPosBeforeRotation();

    expect(spyClear).toHaveBeenCalled();
    expect(selectionService[selectionParam].selectedItemsInitPosBeforeRotation.has('1'));
  });

  it('should set transformation correctly', () => {
    const selectionParam = 'selectionParameters';
    const mockItem: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect', 'getAttribute']);
    mockItem.getAttribute.and.returnValue('1');
    const mockRotationAxis = new Map<string, string>();
    mockRotationAxis.set('x', '400')
                    .set('y', '400');
    const mockOldTransformation = new Map<string, string>();
    mockOldTransformation.set('xTranslation', '0')
                          .set('yTranslation', '0')
                          .set('dRotation', '0');
    const mockDegree = 15;
    const mockSelectedItemsInitPosBeforeRotation = new Map<string, number[]>();
    const fourHundred = 400;
    mockSelectedItemsInitPosBeforeRotation.set('1', [fourHundred, fourHundred, 0, 0, 0]);
    selectionService[selectionParam].selectedItemsInitPosBeforeRotation = mockSelectedItemsInitPosBeforeRotation;
    const transformation = rotationService.setTransformation(mockDegree, mockOldTransformation, mockRotationAxis, mockItem);

    expect(transformation).toBe('translate(0,0) rotate(15,400,400)');
  });

  it('should rotate selection correctly when shift key', () => {
    const selectionParam = 'selectionParameters';
    const mockDegree = 15;
    const mockCenterOfItems = true;
    const mockCanvasSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockSelectedItems = new Map<string, SVGElement>();
    const mockOldTransformation = new Map<string, string>();
    mockOldTransformation.set('xTranslation', '0')
                          .set('yTranslation', '0')
                          .set('dRotation', '0');
    const mockTransformation = 'translate(0,0) rotate(15, 400, 400)';
    const mockSelectedItemsBoxRotationAxis = new Map<string, string>();
    const mockSelectedItemsRotationAxis = new Map<string, string[]>();
    mockSelectedItemsRotationAxis.set('1', ['400', '400']);
    mockSVG.getAttribute.withArgs('id').and.returnValue('1');

    selectionService[selectionParam].selectedItemsRotationAxis = mockSelectedItemsRotationAxis;
    selectionService[selectionParam].selectedItemsBoxRotationAxis = mockSelectedItemsBoxRotationAxis;
    const spyFindMatrixValues = spyOn(selectionService, 'findMatrixValues');
    spyFindMatrixValues.and.returnValue(mockOldTransformation);
    mockSelectedItems.set('1', mockSVG);
    selectionService[selectionParam].selectedItemsRect = mockSelectedItemsRect;
    selectionService[selectionParam].selectedItems = mockSelectedItems;
    const renderer = 'renderer';
    const spySetTransformation = spyOn(rotationService, 'setTransformation');
    spySetTransformation.and.returnValue(mockTransformation);
    const spyUpdateSelectedItemsBox = spyOn(selectionService, 'updateSelectedItemsBox');
    const spyDrawSelectedItemsRect = spyOn(selectionService, 'drawSelectedItemsRect');
    const spyCalculateRotationAxis = spyOn(selectionService, 'calculateRotationAxis');

    const mockTopSelectedItemsBox = 300;
    const mockBottomSelectedItemsBox = 500;
    const mockLeftSelectedItemsBox = 300;
    const mockRightSelectedItemsBox = 500;
    selectionService[selectionParam].topSelectedItemsBox = mockTopSelectedItemsBox;
    selectionService[selectionParam].bottomSelectedItemsBox = mockBottomSelectedItemsBox;
    selectionService[selectionParam].leftSelectedItemsBox = mockLeftSelectedItemsBox;
    selectionService[selectionParam].rightSelectedItemsBox = mockRightSelectedItemsBox;

    rotationService.rotateSelection(mockDegree, mockCenterOfItems, mockCanvasSVG);

    expect(rotationService[renderer].removeChild).toHaveBeenCalledWith(mockCanvasSVG, mockSelectedItemsRect);
    expect(rotationService[renderer].setAttribute).toHaveBeenCalledWith(mockSVG, 'transform', mockTransformation);
    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDrawSelectedItemsRect).toHaveBeenCalled();
    expect(spySetTransformation).toHaveBeenCalled();
    expect(spyCalculateRotationAxis).toHaveBeenCalledWith(mockTopSelectedItemsBox, mockBottomSelectedItemsBox,
      mockLeftSelectedItemsBox, mockRightSelectedItemsBox, mockSelectedItemsBoxRotationAxis);
  });

  it('should rotate selection correctly when not shift key', () => {
    const selectionParam = 'selectionParameters';
    const mockDegree = 15;
    const mockCenterOfItems = false;
    const mockCanvasSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSelectedItemsRect: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    const mockSelectedItems = new Map<string, SVGElement>();
    const mockOldTransformation = new Map<string, string>();
    mockOldTransformation.set('xTranslation', '0')
                          .set('yTranslation', '0')
                          .set('dRotation', '0');
    const mockTransformation = 'translate(0,0) rotate(15, 400, 400)';
    const mockSelectedItemsBoxRotationAxis = new Map<string, string>();

    selectionService[selectionParam].selectedItemsBoxRotationAxis = mockSelectedItemsBoxRotationAxis;
    const spyFindMatrixValues = spyOn(selectionService, 'findMatrixValues');
    spyFindMatrixValues.and.returnValue(mockOldTransformation);
    mockSelectedItems.set('1', mockSVG);
    selectionService[selectionParam].selectedItemsRect = mockSelectedItemsRect;
    selectionService[selectionParam].selectedItems = mockSelectedItems;
    const renderer = 'renderer';
    const spySetTransformation = spyOn(rotationService, 'setTransformation');
    spySetTransformation.and.returnValue(mockTransformation);
    const spyUpdateSelectedItemsBox = spyOn(selectionService, 'updateSelectedItemsBox');
    const spyDrawSelectedItemsRect = spyOn(selectionService, 'drawSelectedItemsRect');
    rotationService.rotateSelection(mockDegree, mockCenterOfItems, mockCanvasSVG);

    expect(rotationService[renderer].removeChild).toHaveBeenCalledWith(mockCanvasSVG, mockSelectedItemsRect);
    expect(rotationService[renderer].setAttribute).toHaveBeenCalledWith(mockSVG, 'transform', mockTransformation);
    expect(spyUpdateSelectedItemsBox).toHaveBeenCalled();
    expect(spyDrawSelectedItemsRect).toHaveBeenCalled();
    expect(spySetTransformation).toHaveBeenCalledWith(mockDegree, mockOldTransformation, mockSelectedItemsBoxRotationAxis, mockSVG);
  });

});

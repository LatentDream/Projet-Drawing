import { TestBed } from '@angular/core/testing';

import { Renderer2, RendererFactory2 } from '@angular/core';
import { ClickEventDispatcherService } from '../dispatcher/click-event-dispatcher.service';
import { SelectionService } from '../selection/selection.service';
import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  let service: ClipboardService;
  let selection: SelectionService;
  let CEDS: ClickEventDispatcherService;
  let renderer: Renderer2;
  const five = 5;
  const ten = 10;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
    service = TestBed.get(ClipboardService);
    selection = TestBed.get(SelectionService);
    CEDS = TestBed.get(ClickEventDispatcherService);
    renderer = TestBed.get(RendererFactory2).createRenderer(null, null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.clipboard).toEqual([]);
    expect(service.renderer).toBeTruthy();
    expect(service.chainedPaste).toEqual(1);
    expect(service.chainedPasteOffset).toEqual(0);
  });

  // action method
  it('should call copy', () => {
    CEDS.canvas = document.createElement('svg') as unknown as SVGElement;
    const spy = spyOn(service, 'copy');

    service.action('c');

    expect(spy).toHaveBeenCalled();
    expect(service.canvas).toBe(CEDS.canvas);
  });

  it('should call paste', () => {
    CEDS.canvas = document.createElement('svg') as unknown as SVGElement;
    const spy = spyOn(service, 'paste');

    service.action('v');

    expect(spy).toHaveBeenCalled();
    expect(service.canvas).toBe(CEDS.canvas);
  });

  it('should call duplicate', () => {
    CEDS.canvas = document.createElement('svg') as unknown as SVGElement;
    const spy = spyOn(service, 'duplicate');

    service.action('d');

    expect(spy).toHaveBeenCalled();
    expect(service.canvas).toBe(CEDS.canvas);
  });

  it('should call cut', () => {
    CEDS.canvas = document.createElement('svg') as unknown as SVGElement;
    const spy = spyOn(service, 'cut');

    service.action('x');

    expect(spy).toHaveBeenCalled();
    expect(service.canvas).toBe(CEDS.canvas);
  });

  it('should call nothing', () => {
    CEDS.canvas = document.createElement('svg') as unknown as SVGElement;
    const spyCopy = spyOn(service, 'copy');

    const spyCut = spyOn(service, 'cut');
    const spyPaste = spyOn(service, 'paste');
    const spyDup = spyOn(service, 'duplicate');
    service.action('a');

    expect(spyCopy).not.toHaveBeenCalled();
    expect(spyCut).not.toHaveBeenCalled();
    expect(spyPaste).not.toHaveBeenCalled();
    expect(spyDup).not.toHaveBeenCalled();
    expect(service.canvas).toBe(CEDS.canvas);
  });

  // Copy method
  it('should copy selected items onto the clipboard', () => {
    selection.selectionParameters.selectedItems.set('1', renderer.createElement('circle', 'svg'));
    selection.selectionParameters.rightSelectedItemsBox = five;
    selection.selectionParameters.bottomSelectedItemsBox = ten;

    service.copy();

    expect(service.chainedPaste).toEqual(1);
    expect(service.chainedPasteOffset).toEqual(0);
    expect(service.transformOffset).toEqual({ x: 5, y: 10 });
    expect(service.clipboard).toEqual([renderer.createElement('circle', 'svg')]);
  });

  it('should NOT copy selected items onto the clipboard', () => {
    selection.selectionParameters.rightSelectedItemsBox = five;
    selection.selectionParameters.bottomSelectedItemsBox = ten;

    service.copy();

    expect(service.transformOffset).not.toEqual({ x: 5, y: 10 });
    expect(service.clipboard).toEqual([]);
  });

  // Paste method
  it('should paste the clipboard on the canvas', () => {
    const el = renderer.createElement('rect', 'svg');
    service.clipboard.push(el);

    service.canvas = renderer.createElement('svg', 'svg');
    service.canvas.appendChild(el);
    service.transformOffset = { x: 10, y: 10 };
    CEDS.itemCount = five;

    spyOnProperty(service.canvas, 'clientWidth').and.returnValue(ten);
    spyOnProperty(service.canvas, 'clientHeight').and.returnValue(ten);
    const spySetAtt = spyOn(service.renderer, 'setAttribute');
    const spyAppChild = spyOn(service.renderer, 'appendChild');
    const spyUpdate = spyOn(selection, 'updateForClipboard');
    const spySelectMatrix = spyOn(selection, 'findMatrixValues').and.callFake((copy: Node) => {
      const map = new Map<string, string>();
      map.set('xTranslation', '10')
        .set('yTranslation', '10')
        .set('dRotation', '15')
        .set('xRotation', '20')
        .set('yRotation', '20');
      return map;
    });

    service.paste();
    const six = 6;
    expect(CEDS.itemCount).toEqual(six);
    expect(spyAppChild).toHaveBeenCalled();
    expect(spySelectMatrix).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
    expect(spySetAtt).toHaveBeenCalledTimes(2);
    expect(service.transformOffset).toEqual({ x: 0, y: 0 });

    expect(service.chainedPaste).toEqual(2);
    expect(service.chainedPasteOffset).toEqual(0);

  });

  it('should paste the clipboard on the canvas with offset', () => {
    const el = renderer.createElement('rect', 'svg');
    service.clipboard.push(el);

    service.canvas = renderer.createElement('svg', 'svg');
    service.canvas.appendChild(el);
    service.transformOffset = { x: 20, y: 20 };
    CEDS.itemCount = five;
    spyOnProperty(service.canvas, 'clientWidth').and.returnValue(ten);
    spyOnProperty(service.canvas, 'clientHeight').and.returnValue(ten);

    const spySetAtt = spyOn(service.renderer, 'setAttribute');
    const spyAppChild = spyOn(service.renderer, 'appendChild');
    const spyUpdate = spyOn(selection, 'updateForClipboard');
    const spySelectMatrix = spyOn(selection, 'findMatrixValues').and.callFake((copy: Node) => {
      const map = new Map<string, string>();
      map.set('xTranslation', '10')
        .set('yTranslation', '10')
        .set('dRotation', '15')
        .set('xRotation', '20')
        .set('yRotation', '20');
      return map;
    });

    service.paste();
    const six = 6;
    expect(CEDS.itemCount).toEqual(six);
    expect(spyAppChild).toHaveBeenCalled();
    expect(spySelectMatrix).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
    expect(spySetAtt).toHaveBeenCalledTimes(2);
    expect(service.transformOffset).toEqual({ x: 0, y: 0 });

    expect(service.chainedPaste).toEqual(2);
    const twenty = 20;
    expect(service.chainedPasteOffset).toEqual(twenty);

  });

  it('should NOT paste the clipboard on the canvas with offset', () => {
    const el = renderer.createElement('rect', 'svg');

    service.canvas = renderer.createElement('svg', 'svg');
    service.canvas.appendChild(el);
    service.transformOffset = { x: 20, y: 20 };
    CEDS.itemCount = five;
    spyOnProperty(service.canvas, 'clientWidth').and.returnValue(ten);
    spyOnProperty(service.canvas, 'clientHeight').and.returnValue(ten);

    const spySetAtt = spyOn(service.renderer, 'setAttribute');
    const spyAppChild = spyOn(service.renderer, 'appendChild');
    const spyUpdate = spyOn(selection, 'updateForClipboard');
    const spySelectMatrix = spyOn(selection, 'findMatrixValues').and.callFake((copy: Node) => {
      const map = new Map<string, string>();
      map.set('xTranslation', '10')
        .set('yTranslation', '10')
        .set('dRotation', '15')
        .set('xRotation', '20')
        .set('yRotation', '20');
      return map;
    });

    service.paste();

    expect(CEDS.itemCount).toEqual(five);
    expect(spyAppChild).not.toHaveBeenCalled();
    expect(spySelectMatrix).not.toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
    expect(spySetAtt).not.toHaveBeenCalled();
    expect(service.transformOffset).toEqual({ x: 20, y: 20 });

    expect(service.chainedPaste).toEqual(1);
    expect(service.chainedPasteOffset).toEqual(0);

  });

  // Duplicate method
  it('should duplicate selection', () => {
    const spyCopy = spyOn(service, 'copy');
    const spyPaste = spyOn(service, 'paste');

    service.duplicate();

    expect(spyCopy).toHaveBeenCalled();
    expect(spyPaste).toHaveBeenCalled();
  });

  // Cut methods
  it('should cut selection', () => {
    const spyCopy = spyOn(service, 'copy');
    const spyDelete = spyOn(service, 'delete');

    service.cut();

    expect(spyCopy).toHaveBeenCalled();
    expect(spyDelete).toHaveBeenCalled();
  });

  // Delete method
  it('should delete selection', () => {
    const el = renderer.createElement('circle', 'svg');
    selection.selectionParameters.selectedItems.set('1', el);
    service.canvas = renderer.createElement('svg', 'svg');
    service.canvas.appendChild(el);
    renderer.appendChild(service.canvas, el);
    const spyRenderer = spyOn(service.renderer, 'removeChild');
    const spyUpdate = spyOn(selection, 'updateForClipboard');

    service.delete();

    expect(spyRenderer).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalledWith(service.canvas, true);
  });

  it('should NOT delete selection', () => {
    service.canvas = renderer.createElement('svg', 'svg');
    const spyRenderer = spyOn(service.renderer, 'removeChild');
    const spyUpdate = spyOn(selection, 'updateForClipboard');

    service.delete();

    expect(spyRenderer).not.toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
  });
});

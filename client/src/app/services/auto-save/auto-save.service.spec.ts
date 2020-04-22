import { ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClickEventDispatcherService } from '../dispatcher/click-event-dispatcher.service';
import { AUTOSAVE } from './auto-save.enum';
import { AutoSaveService } from './auto-save.service';

describe('AutoSaveService', () => {
  let service: AutoSaveService;
  let CEDS: ClickEventDispatcherService;
  let rendererFactory: RendererFactory2;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2]
    });
    CEDS = TestBed.get(ClickEventDispatcherService);
    service = TestBed.get(AutoSaveService);
    rendererFactory = TestBed.get(RendererFactory2);
    renderer = rendererFactory.createRenderer(null, null);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize all attributes', () => {
    expect(service.addRemoveOB).toBeTruthy();
    expect(service.attributesOB).toBeTruthy();
    expect(CEDS).toBeTruthy();
    expect(service.addRemoveOB.observer).toBeTruthy();
    expect(service.attributesOB.observer).toBeTruthy();
    expect(service.addRemoveOB.config).toEqual({ childList: true });
    expect(service.attributesOB.config).toEqual({
      childList: true, attributes: true,
      attributeOldValue: true, subtree: true, attributeFilter: ['stroke', 'fill']
    });
  });

  // SetElement method
  it('should set renderer and element of undoRedoService', () => {
    const el = renderer.createElement('svg', 'svg');
    const elRef = new ElementRef<HTMLElement>(el);
    const spy = spyOn(service, 'enable');

    service.setElement(el);
    expect(service.element).toEqual(elRef);
    expect(service.renderer).toEqual(rendererFactory.createRenderer(elRef, null));
    expect(spy).toHaveBeenCalled();
  });

  it('should save in the localstorage', () => {
    CEDS.canvas = renderer.createElement('svg', 'http://www.w3.org/2000/svg');
    renderer.setAttribute(CEDS.canvas, 'class', 'canvas');
    renderer.setAttribute(CEDS.canvas, 'xmlns', 'http://www.w3.org/2000/svg');
    CEDS.isDrawingBlank = true;
    service.setElement(CEDS.canvas);
    localStorage.clear();
    service.save();
    expect(localStorage.getItem(AUTOSAVE.LOCATION)).not.toEqual(null);
  });

  it('should save when svg is add to the canvas', () => {
    const mockMR = new MockMutationRecord();
    mockMR.addedNodes.push(renderer.createElement('circle', 'svg'));
    mockMR.type = 'childList';
    const mockMRL = [mockMR];
    const spySave = spyOn(service, 'save');
    service.addRemoveOB.callback(mockMRL as unknown as MutationRecord[]);
    expect(spySave).toHaveBeenCalled();
  });

  it('should not save when type is not childList', () => {
    const mockMR = new MockMutationRecord();
    mockMR.addedNodes.push(renderer.createElement('circle', 'svg'));
    mockMR.type = '';
    const mockMRL = [mockMR];
    const spySave = spyOn(service, 'save');
    service.addRemoveOB.callback(mockMRL as unknown as MutationRecord[]);
    expect(spySave).not.toHaveBeenCalled();
  });

  it('should save when attributes is change', () => {
    const ceds = 'CEDS';
    const mockMR = new MockMutationRecord();
    mockMR.target = renderer.createElement('circle', 'svg');
    mockMR.type = 'attributes';
    mockMR.attributeName = 'stroke';
    mockMR.oldValue = 'rgba(0,0,0,1)';
    service[ceds].currentTool = 'line';
    const mockMRL = [mockMR];
    const spySave = spyOn(service, 'save');
    service.attributesOB.callback(mockMRL as unknown as MutationRecord[]);
    expect(spySave).toHaveBeenCalled();
  });

});

class MockMutationRecord {
  type: string;
  target: SVGElement;
  addedNodes: Node[] = [];
  removedNodes: Node[] = [];
  attributeName: string | null;
  oldValue: string | null;
}

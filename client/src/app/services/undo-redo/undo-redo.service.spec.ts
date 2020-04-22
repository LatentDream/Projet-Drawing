import { ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Action, ApplicatorData } from 'src/app/classes/action';
import { ClickEventDispatcherService } from '../dispatcher/click-event-dispatcher.service';
import { EraseService } from '../erase/erase.service';
import { UNDOREDOCONSTANTE } from './enum';
import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService', () => {
  let service: UndoRedoService;
  let CEDS: ClickEventDispatcherService;
  let rendererFactory: RendererFactory2;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2]
    });
    CEDS = TestBed.get(ClickEventDispatcherService);
    service = TestBed.get(UndoRedoService);
    rendererFactory = TestBed.get(RendererFactory2);
    renderer = rendererFactory.createRenderer(null, null);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize all attributes', () => {
    expect(service.addRemoveOB).toBeTruthy();
    expect(service.attributesOB).toBeTruthy();
    expect(service.unableToRedo).toBe(true);
    expect(service.unableToUndo).toBe(true);
    expect(service.undoQueue).toEqual([]);
    expect(service.redoQueue).toEqual([]);
    expect(CEDS).toBeTruthy();
    expect(service.addRemoveOB.observer).toBeTruthy();
    expect(service.attributesOB.observer).toBeTruthy();
    expect(service.addRemoveOB.config).toEqual({ childList: true });
    expect(service.attributesOB.config).toEqual({
      childList: true, attributes: true,
      attributeOldValue: true, subtree: true, attributeFilter: ['stroke', 'fill', 'transform']
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

  // Enable method
  it('should start observe', () => {
    const el = renderer.createElement('svg', 'svg');
    service.element = new ElementRef<HTMLElement>(el);
    const spy1 = spyOn(service.addRemoveOB.observer, 'observe');
    const spy2 = spyOn(service.attributesOB.observer, 'observe');

    service.enable();

    expect(spy1).toHaveBeenCalledWith(el, service.addRemoveOB.config);
    expect(spy2).toHaveBeenCalledWith(el, service.attributesOB.config);
  });

  // Disconnect method
  it('should disconnect observe', () => {

    const spy1 = spyOn(service.addRemoveOB.observer, 'disconnect');
    const spy2 = spyOn(service.attributesOB.observer, 'disconnect');

    service.disable();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  // Undo and Redo methods
  it('should disable, call undoSwitch and enable on undo()', () => {
    const action = new Action('add', renderer.createElement('circle', 'svg'));
    service.undoQueue.push(action);

    const spyDisable = spyOn(service, 'disable');
    const spyPop = spyOn(service.undoQueue, 'pop').and.callThrough();
    const spyPush = spyOn(service.redoQueue, 'push').and.callThrough();
    const spySwitch = spyOn(service, 'undoSwitch');
    const spyUpdate = spyOn(service, 'update');
    const spyEnable = spyOn(global, 'setTimeout');

    service.undo();

    expect(spyDisable).toHaveBeenCalled();
    expect(spyPop).toHaveBeenCalled();
    expect(spyPush).toHaveBeenCalledWith(action);
    expect(spySwitch).toHaveBeenCalledWith(action);
    expect(spyUpdate).toHaveBeenCalled();
    expect(spyEnable).toHaveBeenCalledWith(service.enable, UNDOREDOCONSTANTE._100);

  });

  it('should disable, NOT call undoSwitch then enable on undo()', () => {
    const action = undefined;
    service.undoQueue.push(action as unknown as Action);

    const spyDisable = spyOn(service, 'disable');
    const spyPop = spyOn(service.undoQueue, 'pop').and.callThrough();
    const spyPush = spyOn(service.redoQueue, 'push').and.callThrough();
    const spySwitch = spyOn(service, 'undoSwitch');
    const spyUpdate = spyOn(service, 'update');
    const spyEnable = spyOn(global, 'setTimeout');

    service.undo();

    expect(spyDisable).toHaveBeenCalled();
    expect(spyPop).toHaveBeenCalled();
    expect(spyPush).not.toHaveBeenCalled();
    expect(spySwitch).not.toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
    expect(spyEnable).toHaveBeenCalledWith(service.enable, UNDOREDOCONSTANTE._100);

  });

  it('should disable, call redoSwitch and enable on redo()', () => {
    const action = new Action('add', renderer.createElement('circle', 'svg'));
    service.redoQueue.push(action);

    const spyDisable = spyOn(service, 'disable');
    const spyPop = spyOn(service.redoQueue, 'pop').and.callThrough();
    const spyPush = spyOn(service.undoQueue, 'push').and.callThrough();
    const spySwitch = spyOn(service, 'redoSwitch');
    const spyUpdate = spyOn(service, 'update');
    const spyEnable = spyOn(global, 'setTimeout');

    service.redo();

    expect(spyDisable).toHaveBeenCalled();
    expect(spyPop).toHaveBeenCalled();
    expect(spyPush).toHaveBeenCalledWith(action);
    expect(spySwitch).toHaveBeenCalledWith(action);
    expect(spyUpdate).toHaveBeenCalled();
    expect(spyEnable).toHaveBeenCalledWith(service.enable, UNDOREDOCONSTANTE._100);

  });

  it('should disable, NOT call redoSwitch then enable on redo()', () => {
    const action = undefined;
    service.redoQueue.push(action as unknown as Action);

    const spyDisable = spyOn(service, 'disable');
    const spyPop = spyOn(service.redoQueue, 'pop').and.callThrough();
    const spyPush = spyOn(service.undoQueue, 'push').and.callThrough();
    const spySwitch = spyOn(service, 'redoSwitch');
    const spyUpdate = spyOn(service, 'update');
    const spyEnable = spyOn(global, 'setTimeout');

    service.redo();

    expect(spyDisable).toHaveBeenCalled();
    expect(spyPop).toHaveBeenCalled();
    expect(spyPush).not.toHaveBeenCalled();
    expect(spySwitch).not.toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
    expect(spyEnable).toHaveBeenCalledWith(service.enable, UNDOREDOCONSTANTE._100);

  });

  // UndoSwitch method
  it('should undo "add" action', () => {
    const el: HTMLElement = renderer.createElement('circle', 'svg');
    const svg = renderer.createElement('svg', 'svg');
    renderer.appendChild(svg, el);
    const action = new Action('add', [el]);
    service.setElement(svg);

    const spyForEach = spyOn(action.target, 'forEach').and.callThrough();
    const spyRenderer = spyOn(service.renderer, 'removeChild');
    const spySetAtt = spyOn(service.renderer, 'setAttribute');
    service.undoSwitch(action);

    expect(spyForEach).toHaveBeenCalled();
    expect(spyRenderer).toHaveBeenCalledWith(service.element.nativeElement, el as Node);
    expect(spySetAtt).not.toHaveBeenCalled();
  });

  it('should undo "remove" action', () => {
    const el: HTMLElement = renderer.createElement('circle', 'svg');
    const svg = renderer.createElement('svg', 'svg');
    const action = new Action('remove', [el]);
    service.setElement(svg);
    service.undoQueue.push(new Action('add', [renderer.createElement('circle', 'svg')]));

    const spyForEach = spyOn(action.target, 'forEach').and.callThrough();
    const spyRenderer = spyOn(service.renderer, 'appendChild');
    const spySetAtt = spyOn(service.renderer, 'setAttribute');
    const spyUndo = spyOn(service, 'undo');
    service.undoSwitch(action);

    expect(spyForEach).toHaveBeenCalled();
    expect(spyRenderer).toHaveBeenCalledWith(service.element.nativeElement, el as Node);
    expect(spySetAtt).not.toHaveBeenCalled();
    expect(spyUndo).not.toHaveBeenCalled();
  });

  it('should undo "remove" action and the following "remove action"', () => {
    const el: HTMLElement = renderer.createElement('circle', 'svg');
    const svg = renderer.createElement('svg', 'svg');
    const action = new Action('remove', [el]);
    service.setElement(svg);
    service.undoQueue.push(new Action('remove', [renderer.createElement('circle', 'svg')]));

    const spyForEach = spyOn(action.target, 'forEach').and.callThrough();
    const spyRenderer = spyOn(service.renderer, 'appendChild');
    const spySetAtt = spyOn(service.renderer, 'setAttribute');
    const spyUndo = spyOn(service, 'undo');
    service.undoSwitch(action);

    expect(spyForEach).toHaveBeenCalled();
    expect(spyRenderer).toHaveBeenCalledWith(service.element.nativeElement, el as Node);
    expect(spySetAtt).not.toHaveBeenCalled();
    expect(spyUndo).toHaveBeenCalled();
  });

  it('should undo "applicator" action', () => {
    const el = renderer.createElement('circle', 'svg');
    renderer.setAttribute(el, 'stroke', 'rgba(255,255,255,1)');
    const appData = new ApplicatorData(el, 'stroke', 'rgba(0,0,0,1)');
    const svg = renderer.createElement('svg', 'svg');
    const action = new Action('applicator', appData);
    service.setElement(svg);

    const spySetAtt = spyOn(action.target.element, 'getAttribute').and.callThrough();
    const spyRenderer = spyOn(service.renderer, 'setAttribute');
    const spyAppend = spyOn(renderer, 'appendChild');
    const spyRemove = spyOn(renderer, 'removeChild');
    service.undoSwitch(action);

    expect(spySetAtt).toHaveBeenCalledWith(action.target.attName);
    expect(spyRenderer).toHaveBeenCalledWith(action.target.element, action.target.attName, 'rgba(0,0,0,1)');
    expect(action.target.oldValue).toEqual('rgba(255,255,255,1)');
    expect(spyAppend).not.toHaveBeenCalled();
    expect(spyRemove).not.toHaveBeenCalled();
  });

  it('should undo "move" action', () => {
    const el: HTMLElement = renderer.createElement('circle', 'svg');
    const svg = renderer.createElement('svg', 'svg');
    const action = new Action('move', [el, 'translate(-10 10)']);
    service.setElement(svg);
    service.undoQueue.push(new Action('add', [renderer.createElement('circle', 'svg')]));

    const spyRenderer = spyOn(service.renderer, 'setAttribute');
    const spyUndo = spyOn(service, 'undo');
    service.undoSwitch(action);

    expect(spyRenderer).toHaveBeenCalledWith(el, 'transform', 'translate(-10 10)');
    expect(spyUndo).not.toHaveBeenCalled();
  });

  it('should undo "move" action and the following "move" actions', () => {
    const el: HTMLElement = renderer.createElement('circle', 'svg');
    const svg = renderer.createElement('svg', 'svg');
    const action = new Action('move', [el, 'translate(-10 10)']);
    service.setElement(svg);
    service.undoQueue.push(new Action('move', [renderer.createElement('circle', 'svg'), 'translate(-20 20)']));

    const spyRenderer = spyOn(service.renderer, 'setAttribute');
    const spyUndo = spyOn(service, 'undo');
    service.undoSwitch(action);

    expect(spyRenderer).toHaveBeenCalledWith(el, 'transform', 'translate(-10 10)');
    expect(spyUndo).toHaveBeenCalled();
  });

  // RedoSwitch method
  it('should redo "remove" action', () => {
    const el: HTMLElement = renderer.createElement('circle', 'svg');
    const svg = renderer.createElement('svg', 'svg');
    renderer.appendChild(svg, el);
    const action = new Action('remove', [el]);
    service.setElement(svg);
    service.redoQueue.push(new Action('add', [renderer.createElement('circle', 'svg')]));

    const spyForEach = spyOn(action.target, 'forEach').and.callThrough();
    const spyRenderer = spyOn(service.renderer, 'removeChild');
    const spySetAtt = spyOn(service.renderer, 'setAttribute');
    const spyRedo = spyOn(service, 'redo');
    service.redoSwitch(action);

    expect(spyForEach).toHaveBeenCalled();
    expect(spyRenderer).toHaveBeenCalledWith(service.element.nativeElement, el as Node);
    expect(spySetAtt).not.toHaveBeenCalled();
    expect(spyRedo).not.toHaveBeenCalled();
  });

  it('should redo "remove" action', () => {
    const el: HTMLElement = renderer.createElement('circle', 'svg');
    const svg = renderer.createElement('svg', 'svg');
    renderer.appendChild(svg, el);
    const action = new Action('remove', [el]);
    service.setElement(svg);
    service.redoQueue.push(new Action('remove', [renderer.createElement('circle', 'svg')]));

    const spyForEach = spyOn(action.target, 'forEach').and.callThrough();
    const spyRenderer = spyOn(service.renderer, 'removeChild');
    const spySetAtt = spyOn(service.renderer, 'setAttribute');
    const spyRedo = spyOn(service, 'redo');
    service.redoSwitch(action);

    expect(spyForEach).toHaveBeenCalled();
    expect(spyRenderer).toHaveBeenCalledWith(service.element.nativeElement, el as Node);
    expect(spySetAtt).not.toHaveBeenCalled();
    expect(spyRedo).toHaveBeenCalled();
  });

  it('should redo "add" action', () => {
    const el: HTMLElement = renderer.createElement('circle', 'svg');
    const svg = renderer.createElement('svg', 'svg');
    const action = new Action('add', [el]);
    service.setElement(svg);

    const spyForEach = spyOn(action.target, 'forEach').and.callThrough();
    const spyRenderer = spyOn(service.renderer, 'appendChild');
    const spySetAtt = spyOn(service.renderer, 'setAttribute');
    service.redoSwitch(action);

    expect(spyForEach).toHaveBeenCalled();
    expect(spyRenderer).toHaveBeenCalledWith(service.element.nativeElement, el as Node);
    expect(spySetAtt).not.toHaveBeenCalled();
  });

  it('should undo "applicator" action', () => {
    const el = renderer.createElement('circle', 'svg');
    renderer.setAttribute(el, 'stroke', 'rgba(255,255,255,1)');
    const appData = new ApplicatorData(el, 'stroke', 'rgba(0,0,0,1)');
    const svg = renderer.createElement('svg', 'svg');
    const action = new Action('applicator', appData);
    service.setElement(svg);

    const spySetAtt = spyOn(action.target.element, 'getAttribute').and.callThrough();
    const spyRenderer = spyOn(service.renderer, 'setAttribute');
    const spyAppend = spyOn(renderer, 'appendChild');
    const spyRemove = spyOn(renderer, 'removeChild');
    service.redoSwitch(action);

    expect(spySetAtt).toHaveBeenCalledWith(action.target.attName);
    expect(spyRenderer).toHaveBeenCalledWith(action.target.element, action.target.attName, 'rgba(0,0,0,1)');
    expect(action.target.oldValue).toEqual('rgba(255,255,255,1)');
    expect(spyAppend).not.toHaveBeenCalled();
    expect(spyRemove).not.toHaveBeenCalled();
  });

  it('should redo "move" action', () => {
    const el: HTMLElement = renderer.createElement('circle', 'svg');
    const svg = renderer.createElement('svg', 'svg');
    const action = new Action('move', [el, 'translate(-10 10)']);
    service.setElement(svg);
    service.redoQueue.push(new Action('add', [renderer.createElement('circle', 'svg')]));

    const spyRenderer = spyOn(service.renderer, 'setAttribute');
    const spyredo = spyOn(service, 'redo');
    service.redoSwitch(action);

    expect(spyRenderer).toHaveBeenCalledWith(el, 'transform', 'translate(-10 10)');
    expect(spyredo).not.toHaveBeenCalled();
  });

  it('should redo "move" action and the following "move" actions', () => {
    const el: HTMLElement = renderer.createElement('circle', 'svg');
    const svg = renderer.createElement('svg', 'svg');
    const action = new Action('move', [el, 'translate(-10 10)']);
    service.setElement(svg);
    service.redoQueue.push(new Action('move', [renderer.createElement('circle', 'svg'), 'translate(-20 20)']));

    const spyRenderer = spyOn(service.renderer, 'setAttribute');
    const spyredo = spyOn(service, 'redo');
    service.redoSwitch(action);

    expect(spyRenderer).toHaveBeenCalledWith(el, 'transform', 'translate(-10 10)');
    expect(spyredo).toHaveBeenCalled();
  });

  // Update Method
  it('should set unableToUndo and unableToRedo to false', () => {
    service.undoQueue = [new Action('add', renderer.createElement('circle', 'svg'))];
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];

    service.update();

    expect(service.unableToRedo).toBe(false);
    expect(service.unableToUndo).toBe(false);
  });

  it('should set unableToUndo and unableToRedo to true', () => {
    service.undoQueue = [];
    service.redoQueue = [];

    service.update();

    expect(service.unableToRedo).toBe(true);
    expect(service.unableToUndo).toBe(true);
  });

  it('should set unableToUndo to true and unableToRedo to false', () => {
    service.undoQueue = [];
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];

    service.update();

    expect(service.unableToUndo).toBe(true);
    expect(service.unableToRedo).toBe(false);
  });

  it('should set unableToUndo to false and unableToRedo to true', () => {
    service.undoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];
    service.redoQueue = [];

    service.update();

    expect(service.unableToUndo).toBe(false);
    expect(service.unableToRedo).toBe(true);
  });

  // Callback method for 'add' action
  it('should stack "add" action to undoqueue', () => {
    const mockMR = new MockMutationRecord();
    mockMR.addedNodes.push(renderer.createElement('circle', 'svg'));
    mockMR.type = 'childList';
    const mockMRL = [mockMR];
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.addRemoveOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).toEqual([]);
    expect(spyPush).toHaveBeenCalledWith(new Action('add', mockMR.addedNodes));
    expect(spyUpdate).toHaveBeenCalled();
  });

  it('should NOT stack "add" action to undoqueue', () => {
    const mockMR = new MockMutationRecord();
    mockMR.type = 'childList';
    const mockMRL = [mockMR];
    service.redoQueue = [new Action('add', renderer.createElement('circle', 'svg'))];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.addRemoveOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).not.toEqual([]);
    expect(spyPush).not.toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
  });

  // Callback method for 'remove' action
  it('should stack "remove" action to undoqueue', () => {
    const mockMR = new MockMutationRecord();
    mockMR.removedNodes.push(renderer.createElement('circle', 'svg'));
    mockMR.type = 'childList';
    const mockMRL = [mockMR];
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.addRemoveOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).toEqual([]);
    expect(spyPush).toHaveBeenCalledWith(new Action('remove', mockMR.removedNodes));
    expect(spyUpdate).toHaveBeenCalled();
  });

  it('should NOT stack "remove" action to undoqueue', () => {
    const mockMR = new MockMutationRecord();
    mockMR.type = 'childList';
    const mockMRL = [mockMR];
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.addRemoveOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).not.toEqual([]);
    expect(spyPush).not.toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
  });

  // ------ Add and Remove No action done
  it('should NOT queue any action', () => {
    const mockMR = new MockMutationRecord();
    mockMR.addedNodes.push(renderer.createElement('circle', 'svg'));
    mockMR.type = '';
    const mockMRL = [mockMR];
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.addRemoveOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).not.toEqual([]);
    expect(spyPush).not.toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
  });

  it('should NOT queue any action', () => {
    const mockMR = new MockMutationRecord();
    const el = renderer.createElement('circle', 'svg');
    const eraserService = TestBed.get(EraseService);
    eraserService.prop.element = el;
    mockMR.addedNodes.push(el);
    mockMR.removedNodes.push(el);
    mockMR.type = 'childList';
    const mockMRL = [mockMR];
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.addRemoveOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).not.toEqual([]);
    expect(spyPush).not.toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
  });

  // Callback method for 'selection' action
  it('should stack "applicator" action to undoqueue', () => {
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];
    const ceds = 'CEDS';
    const mockMR = new MockMutationRecord();
    mockMR.target = renderer.createElement('circle', 'svg');
    mockMR.type = 'attributes';
    mockMR.attributeName = 'transform';
    mockMR.oldValue = 'translate(-10 10)';
    service[ceds].currentTool = 'selection';
    const mockMRL = [mockMR];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.attributesOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).toEqual([]);
    expect(spyPush).toHaveBeenCalledWith(
      new Action('move', [mockMR.target, mockMR.oldValue])
      );
    expect(spyUpdate).toHaveBeenCalled();
  });

  // Callback method for 'applicator' action
  it('should stack "applicator" action to undoqueue', () => {
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];
    const ceds = 'CEDS';
    const mockMR = new MockMutationRecord();
    mockMR.target = renderer.createElement('circle', 'svg');
    mockMR.type = 'attributes';
    mockMR.attributeName = 'stroke';
    mockMR.oldValue = 'rgba(0,0,0,1)';
    service[ceds].currentTool = 'applicator';
    const mockMRL = [mockMR];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.attributesOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).toEqual([]);
    expect(spyPush).toHaveBeenCalledWith(
      new Action('applicator', new ApplicatorData(mockMR.target, mockMR.attributeName, mockMR.oldValue))
      );
    expect(spyUpdate).toHaveBeenCalled();
  });

  it('should NOT stack "applicator" action to undoqueue (wrong type)', () => {
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];
    const ceds = 'CEDS';
    const mockMR = new MockMutationRecord();
    mockMR.target = renderer.createElement('circle', 'svg');
    mockMR.type = 'childList';
    mockMR.attributeName = 'stroke';
    mockMR.oldValue = 'rgba(0,0,0,1)';
    service[ceds].currentTool = 'applicator';
    const mockMRL = [mockMR];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.attributesOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).not.toEqual([]);
    expect(spyPush).not.toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
  });

  it('should NOT stack "applicator" action to undoqueue (wrong tool)', () => {
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];
    const ceds = 'CEDS';
    const mockMR = new MockMutationRecord();
    mockMR.target = renderer.createElement('circle', 'svg');
    mockMR.type = 'attributes';
    mockMR.attributeName = 'stroke';
    mockMR.oldValue = 'rgba(0,0,0,1)';
    service[ceds].currentTool = 'eraser';
    const mockMRL = [mockMR];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.attributesOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).not.toEqual([]);
    expect(spyPush).not.toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
  });

  it('should NOT stack "applicator" action to undoqueue (attributeName null)', () => {
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];
    const ceds = 'CEDS';
    const mockMR = new MockMutationRecord();
    mockMR.target = renderer.createElement('circle', 'svg');
    mockMR.type = 'attributes';
    mockMR.attributeName = null;
    mockMR.oldValue = 'rgba(0,0,0,1)';
    service[ceds].currentTool = 'line';
    const mockMRL = [mockMR];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.attributesOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).not.toEqual([]);
    expect(spyPush).not.toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
  });

  it('should NOT stack "applicator" action to undoqueue (oldValue null)', () => {
    service.redoQueue = [new Action('remove', renderer.createElement('circle', 'svg'))];
    const ceds = 'CEDS';
    const mockMR = new MockMutationRecord();
    mockMR.target = renderer.createElement('circle', 'svg');
    mockMR.type = 'attributes';
    mockMR.attributeName = 'stroke';
    mockMR.oldValue = null;
    service[ceds].currentTool = 'eraser';
    const mockMRL = [mockMR];

    const spyPush = spyOn(service.undoQueue, 'push');
    const spyUpdate = spyOn(service, 'update');

    service.attributesOB.callback(mockMRL as unknown as MutationRecord[]);

    expect(service.redoQueue).not.toEqual([]);
    expect(spyPush).not.toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
  });
});

class MockMutationRecord {
  type: string;
  // tslint:disable-next-line: no-any
  target: any; // renderer.createElement peut retourner plusieurs type delement
  addedNodes: Node[] = [];
  removedNodes: Node[] = [];
  attributeName: string | null;
  oldValue: string | null;
// tslint:disable-next-line: max-file-line-count
} // Test ne devrait pas etre separe

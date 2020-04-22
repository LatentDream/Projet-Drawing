import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogConfig } from '@angular/material';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { TextService } from 'src/app/services/text/text.service';
import { ExportDrawingDialogComponent } from '../dialog/export-drawing-dialog/export-drawing-dialog.component';
import { SaveDrawingDialogComponent } from '../dialog/save-drawing-dialog/save-drawing-dialog.component';
import { TESTDRAWING } from '../gallery/drawing/enum';
import { DrawMenuComponent } from './draw-menu.component';

describe('DrawMenuComponent', () => {
  let component: DrawMenuComponent;
  let fixture: ComponentFixture<DrawMenuComponent>;
  let mockCEDS: ClickEventDispatcherService;
  let toolSelectionButton: DebugElement;
  let componentHtml: DebugElement;
  let textService: TextService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}, ClickEventDispatcherService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentHtml = fixture.debugElement;
    mockCEDS = TestBed.get(ClickEventDispatcherService);
    textService = TestBed.get(TextService);
    toolSelectionButton = fixture.debugElement.query(By.css('.toolButtonGroupContainerTop'));

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should create the map for the tools selection at construction', () => {
    // Tools Map -> Also verif toolBinding
    const toolMap = 'toolBinding';
    expect(component[toolMap].has('draw')).toBe(true);
    expect(component[toolMap].has('shape')).toBe(true);
    expect(component[toolMap].has('line')).toBe(true);
    expect(component[toolMap].has('text')).toBe(true);
    expect(component[toolMap].has('color')).toBe(true);
    expect(component[toolMap].has('eraser')).toBe(true);
    expect(component[toolMap].has('applicator')).toBe(true);
    expect(component[toolMap].has('spray')).toBe(true);
    expect(component[toolMap].has('selection')).toBe(true);
    expect(component[toolMap].has('grid')).toBe(true);
    expect(component[toolMap].has('c')).toBe(true);
    expect(component[toolMap].has('l')).toBe(true);
    expect(component[toolMap].has('w')).toBe(true);
    expect(component[toolMap].has('e')).toBe(true);
    expect(component[toolMap].has('r')).toBe(true);
    expect(component[toolMap].has('1')).toBe(true);
    expect(component[toolMap].has('2')).toBe(true);
    expect(component[toolMap].has('3')).toBe(true);
    expect(component[toolMap].has('i')).toBe(true);
    expect(component[toolMap].has('a')).toBe(true);
  });

  // Test keyboard shortcut
  it('should call draw when c is pressed', () => {
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: 'c'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('draw');
  });

  it('should call line when l is pressed', () => {
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: 'l'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('line');
  });

  it('should call brush when w is pressed', () => {
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: 'w'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('draw');
  });

  it('should call color when r is pressed', () => {
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: 'r'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('color');
  });

  it('should call rect when 1 is pressed', () => {
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: '1'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('shape');
  });

  it('should call shape when 2 is pressed', () => {
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: '2'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('shape');
  });

  it('should call polygon when 3 is pressed', () => {
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: '3'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('shape');
  });

  it('should call dropper when i is pressed', () => {
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: 'i'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('color');
  });

  it('should call spray when a is pressed', () => {
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: 'a'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('draw');
  });

  it('should call erase when e is pressed', () => {
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: 'e'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('eraser');
  });

  // Undo Redo keyboeard event
  it('should trigger undo', () => {
    component.buttonToggleValue = '';
    const undoRedo = 'undoRedo';
    const clickEventDispatcher = 'clickEventDispatcher';
    const event = new KeyboardEvent('keydown', {key: 'z', ctrlKey: true});
    const spy1 = spyOn(component[undoRedo], 'undo').and.returnValue();
    const spy2 = spyOn(component[clickEventDispatcher], 'hotKeysDown').and.callThrough();
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith('Escape');
  });

  it('should trigger redo', () => {
    component.buttonToggleValue = '';
    const undoRedo = 'undoRedo';
    const event = new KeyboardEvent('keydown', {key: 'Z', ctrlKey: true});
    const spy1 = spyOn(component[undoRedo], 'redo').and.returnValue();
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(spy1).toHaveBeenCalled();
  });

  // GridService keydown events
  it('should trigger toggle of grid', () => {
    component.buttonToggleValue = '';
    const gridService = 'gridService';
    const event = new KeyboardEvent('keydown', {key: 'g', ctrlKey: false});
    const spy1 = spyOn(component[gridService], 'toggleGrid').and.returnValue();
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(spy1).toHaveBeenCalled();
  });

  it('should trigger clipboad delete', () => {
    component.buttonToggleValue = '';
    mockCEDS.currentTool = 'selection';
    const clipboard = 'clipboard';
    const event = new KeyboardEvent('keydown', {key: 'Delete', ctrlKey: false});
    const spy1 = spyOn(component[clipboard], 'delete');
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(spy1).toHaveBeenCalled();
  });

  it('should trigger increment grid', () => {
    component.buttonToggleValue = '';
    const gridService = 'gridService';
    const event = new KeyboardEvent('keydown', {key: '+', ctrlKey: false});
    const spy1 = spyOn(component[gridService], 'increment').and.returnValue();
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(spy1).toHaveBeenCalled();
  });

  it('should trigger decrement grid', () => {
    component.buttonToggleValue = '';
    const gridService = 'gridService';
    const event = new KeyboardEvent('keydown', {key: '-', ctrlKey: false});
    const spy1 = spyOn(component[gridService], 'decrement').and.returnValue();
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(spy1).toHaveBeenCalled();
  });

  // Hotkeys
  it('should call service hotkey when shift is pressed up', () => {
    component.buttonToggleValue = '';
    const spy = spyOn(mockCEDS, 'hotKeysUp').and.callThrough();
    const event = new KeyboardEvent('keyup', {key: 'Shift'});
    component.hotKeysUp(event);
    componentHtml.triggerEventHandler('keyup' , event );
    expect(spy).toHaveBeenCalled();
  });

  it('should not call service hotkey Up when it doesnt exist', () => {
    component.buttonToggleValue = '';
    const spy = spyOn(mockCEDS, 'hotKeysUp').and.callThrough();
    const event = new KeyboardEvent('keyup', {key: 'a'});
    component.hotKeysUp(event);
    componentHtml.triggerEventHandler('keyup' , event );
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should not call service hotkey when shift is pressed up when pop up is active', () => {
    mockCEDS.popUpActive = true;
    component.buttonToggleValue = '';
    const spy = spyOn(mockCEDS, 'hotKeysUp').and.callThrough();
    const event = new KeyboardEvent('keyup', {key: 'Shift'});
    component.hotKeysUp(event);
    componentHtml.triggerEventHandler('keyup' , event );
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call service hotkey when shift is pressed down', () => {
    component.buttonToggleValue = '';
    const spy = spyOn(mockCEDS, 'hotKeysDown').and.callThrough();
    const event = new KeyboardEvent('keydown', {key: 'Shift'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(spy).toHaveBeenCalled();
  });

  it('should call text service write is pressed down', () => {
    component.buttonToggleValue = '';
    mockCEDS.popUpActive = false;
    textService.isText = true;
    const spy = spyOn(textService, 'write');
    const event = new KeyboardEvent('keydown', {key: '3'});
    component.hotKeysDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('Should not be able to use hotkey when pop up is active', () => {
    mockCEDS.popUpActive = true;
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: '1'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('');
  });

  it('should trigger clipboard action', () => {
    const clickEventDispatcher = 'clickEventDispatcher';
    component[clickEventDispatcher].currentTool = 'selection';
    component.buttonToggleValue = '';
    const clipboard = 'clipboard';
    const event = new KeyboardEvent('keydown', {key: '', ctrlKey: true});
    const spy1 = spyOn(component[clipboard], 'action').and.returnValue();
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(spy1).toHaveBeenCalled();
  });

  it('Should not be able to change the current tools if the hotkey is not in the map', () => {
    component.buttonToggleValue = '';
    const event = new KeyboardEvent('keydown', {key: '3'});
    component.hotKeysDown(event);
    componentHtml.triggerEventHandler('keydown' , event );
    expect(component.buttonToggleValue).toEqual('shape');
  });

  it('Should be able to selection the good tool', () => {
    const spy = spyOn(mockCEDS, 'setCurrentTool').and.callThrough();
    toolSelectionButton.triggerEventHandler('change', {value: 'draw'});
    expect(spy).toHaveBeenCalled();
  });

  it('Should not be able to change the current tools the value is not in the map', () => {
    const spy = spyOn(mockCEDS, 'setCurrentTool').and.callThrough();
    toolSelectionButton.triggerEventHandler('change', {value: 'penguins of madagascar'});
    expect(spy).toHaveBeenCalledTimes(0);
  });

  // HotKeys for save drawing
  it('should call openDialogSaveDrawZone when control o is down', () => {
    mockCEDS.popUpActive = false;
    const mockEvent = new KeyboardEvent('keydown', {key: 'o', ctrlKey: true});
    const spy1 = spyOn(component, 'openDialogSaveDrawZone');
    const spy2 = spyOn(mockEvent, 'preventDefault');
    componentHtml.triggerEventHandler('keydown', mockEvent);
    component.hotkeySaveDrawing(mockEvent);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should NOT call openDialogSaveDrawZone when control o is down', () => {
    mockCEDS.popUpActive = true;
    const mockEvent = new KeyboardEvent('keydown', {key: 'o', ctrlKey: true});
    const spy1 = spyOn(component, 'openDialogSaveDrawZone');
    const spy2 = spyOn(mockEvent, 'preventDefault');
    componentHtml.triggerEventHandler('keydown', mockEvent);
    component.hotkeySaveDrawing(mockEvent);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  // HotKeys for export drawing
  it('should call openDialogSaveDrawZone when control o is down', () => {
    mockCEDS.popUpActive = false;
    const mockEvent = new KeyboardEvent('keydown', {key: 'e', ctrlKey: true});
    const spy1 = spyOn(component, 'openDialogExportDrawZone');
    const spy2 = spyOn(mockEvent, 'preventDefault');
    componentHtml.triggerEventHandler('keydown', mockEvent);
    component.hotkeyExportDrawing(mockEvent);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call selectAllItems when control a is down', () => {
    mockCEDS.popUpActive = false;
    const mockEvent = new KeyboardEvent('keydown', {key: 'a', ctrlKey: true});
    const spy1 = spyOn(mockCEDS, 'selectAllItems');
    const spy2 = spyOn(mockEvent, 'preventDefault');
    component.hotkeySelectAll(mockEvent);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should not call selectAllItems when control a is down', () => {
    mockCEDS.popUpActive = true;
    const mockEvent = new KeyboardEvent('keydown', {key: 'a', ctrlKey: true});
    const spy1 = spyOn(mockCEDS, 'selectAllItems');
    const spy2 = spyOn(mockEvent, 'preventDefault');
    component.hotkeySelectAll(mockEvent);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should NOT call openDialogSaveDrawZone when control o is down', () => {
    mockCEDS.popUpActive = true;
    const mockEvent = new KeyboardEvent('keydown', {key: 'e', ctrlKey: true});
    const spy1 = spyOn(component, 'openDialogExportDrawZone');
    const spy2 = spyOn(mockEvent, 'preventDefault');
    componentHtml.triggerEventHandler('keydown', mockEvent);
    component.hotkeyExportDrawing(mockEvent);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should open the gallery when control g is down', () => {
    // Inject drawing into canvas
    const oParser = new DOMParser();
    const oDOM = oParser.parseFromString(TESTDRAWING.DRAWING, 'application/xml');
    mockCEDS.canvas = oDOM.documentElement as Element as SVGElement;
    // Test
    mockCEDS.popUpActive = false;
    const mockEvent = new KeyboardEvent('keydown', {key: 'g', ctrlKey: true});
    const routerAtt = 'router';
    const spy1 = spyOn(component[routerAtt], 'navigateByUrl');
    const spy2 = spyOn(mockEvent, 'preventDefault');
    componentHtml.triggerEventHandler('keydown', mockEvent);
    component.hotkeyGallery(mockEvent);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should NOT call openDialogSaveDrawZone when control o is down', () => {
    // Inject drawing into canvas
    const oParser = new DOMParser();
    const oDOM = oParser.parseFromString(TESTDRAWING.DRAWING, 'application/xml');
    mockCEDS.canvas = oDOM.documentElement as Element as SVGElement;
    // Test
    mockCEDS.popUpActive = true;
    const mockEvent = new KeyboardEvent('keydown', {key: 'g', ctrlKey: true});
    const routerAtt = 'router';
    const spy1 = spyOn(component[routerAtt], 'navigateByUrl');
    const spy2 = spyOn(mockEvent, 'preventDefault');
    componentHtml.triggerEventHandler('keydown', mockEvent);
    component.hotkeyGallery(mockEvent);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call CEDS.rotateSelection(15, false) on hotkeyRotateSelection', () => {
    const mockEvent = new WheelEvent('mousewheel', {deltaY: 0, altKey: false, shiftKey: false});
    mockCEDS.popUpActive = false;
    const fifteen = 15;

    const spyDefault = spyOn(mockEvent, 'preventDefault');
    const spyRotate = spyOn(mockCEDS, 'rotateSelection');

    component.hotkeyRotateSelection(mockEvent);

    expect(spyDefault).toHaveBeenCalled();
    expect(spyRotate).toHaveBeenCalledWith(fifteen, false);
  });

  it('should call CEDS.rotateSelection(15, true) on hotkeyRotateSelection', () => {
    const mockEvent = new WheelEvent('mousewheel', {deltaY: 0, altKey: false, shiftKey: true});
    mockCEDS.popUpActive = false;
    const fifteen = 15;

    const spyDefault = spyOn(mockEvent, 'preventDefault');
    const spyRotate = spyOn(mockCEDS, 'rotateSelection');

    component.hotkeyRotateSelection(mockEvent);

    expect(spyDefault).toHaveBeenCalled();
    expect(spyRotate).toHaveBeenCalledWith(fifteen, true);
  });

  it('should call CEDS.rotateSelection(1, false) on hotkeyRotateSelection', () => {
    const mockEvent = new WheelEvent('mousewheel', {deltaY: 0, altKey: true, shiftKey: false});
    mockCEDS.popUpActive = false;

    const spyDefault = spyOn(mockEvent, 'preventDefault');
    const spyRotate = spyOn(mockCEDS, 'rotateSelection');

    component.hotkeyRotateSelection(mockEvent);

    expect(spyDefault).toHaveBeenCalled();
    expect(spyRotate).toHaveBeenCalledWith(1, false);
  });

  it('should call CEDS.rotateSelection(1, true) on hotkeyRotateSelection', () => {
    const mockEvent = new WheelEvent('mousewheel', {deltaY: 0, altKey: true, shiftKey: true});
    mockCEDS.popUpActive = false;

    const spyDefault = spyOn(mockEvent, 'preventDefault');
    const spyRotate = spyOn(mockCEDS, 'rotateSelection');

    component.hotkeyRotateSelection(mockEvent);

    expect(spyDefault).toHaveBeenCalled();
    expect(spyRotate).toHaveBeenCalledWith(1, true);
  });

  it('should call CEDS.rotateSelection(-1, true) on hotkeyRotateSelection', () => {
    const mockEvent = new WheelEvent('mousewheel', {deltaY: -1, altKey: true, shiftKey: true});
    mockCEDS.popUpActive = false;
    const minusOne = -1;

    const spyDefault = spyOn(mockEvent, 'preventDefault');
    const spyRotate = spyOn(mockCEDS, 'rotateSelection');

    component.hotkeyRotateSelection(mockEvent);

    expect(spyDefault).toHaveBeenCalled();
    expect(spyRotate).toHaveBeenCalledWith(minusOne, true);
  });

  it('should call nothing on hotkeyRotateSelection', () => {
    const mockEvent = new WheelEvent('mousewheel', {deltaY: 0, altKey: true, shiftKey: true});
    mockCEDS.popUpActive = true;

    const spyDefault = spyOn(mockEvent, 'preventDefault');
    const spyRotate = spyOn(mockCEDS, 'rotateSelection');

    component.hotkeyRotateSelection(mockEvent);

    expect(spyDefault).toHaveBeenCalled();
    expect(spyRotate).not.toHaveBeenCalled();
  });

  it('should go to the menu page', () => {
    // Inject drawing into canvas
    const oParser = new DOMParser();
    const oDOM = oParser.parseFromString(TESTDRAWING.DRAWING, 'application/xml');
    mockCEDS.canvas = oDOM.documentElement as Element as SVGElement;
    // Test
    const routerAtt = 'router';
    const spy1 = spyOn(component[routerAtt], 'navigateByUrl');
    component.goToMainMenu();
    expect(spy1).toHaveBeenCalled();
  });

  it('should go to the user guide', () => {
    // Inject drawing into canvas
    const oParser = new DOMParser();
    const oDOM = oParser.parseFromString(TESTDRAWING.DRAWING, 'application/xml');
    mockCEDS.canvas = oDOM.documentElement as Element as SVGElement;
    // Test
    const routerAtt = 'router';
    const spy1 = spyOn(component[routerAtt], 'navigateByUrl');
    component.goToUserGuide();
    expect(spy1).toHaveBeenCalled();
  });

  // OpneDialogSaveDrawZone
  it('should open save dialogRef', () => {
    // Inject drawing into canvas
    const oParser = new DOMParser();
    const oDOM = oParser.parseFromString(TESTDRAWING.DRAWING, 'application/xml');
    mockCEDS.canvas = oDOM.documentElement as Element as SVGElement;

    const spy = spyOn(component.dialog, 'open').and.callThrough();
    const dialogConfig = new MatDialogConfig();
    const dialogRef = 'dialogRefSave';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';

    component.openDialogSaveDrawZone();
    expect(spy).toHaveBeenCalledWith(SaveDrawingDialogComponent, dialogConfig);
    component[dialogRef].close();
    fixture.detectChanges();
    component[dialogRef].afterClosed().subscribe(() => {
      expect(mockCEDS.popUpActive).toBe(false);
    });
  });

   // OpneDialogSaveDrawZone
  it('should open export dialogRef', () => {
    // Inject drawing into canvas
    const oParser = new DOMParser();
    const oDOM = oParser.parseFromString(TESTDRAWING.DRAWING, 'application/xml');
    mockCEDS.canvas = oDOM.documentElement as Element as SVGElement;

    const dialogConfig = new MatDialogConfig();
    const dialogRef = 'dialogRefExport';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '550px';

    const spy = spyOn(component.dialog, 'open').and.callThrough();
    component.openDialogExportDrawZone();
    component[dialogRef].close();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(ExportDrawingDialogComponent, dialogConfig);
    component[dialogRef].afterClosed().subscribe(() => {
      expect(mockCEDS.popUpActive).toBe(false);
    });
  });
// ca vaut pas la peine de separer les tests en plusieurs fichiers. Les tests devraient rester dans le meme ficher pour etre clair
// tslint:disable-next-line: max-file-line-count
});

import { TestBed } from '@angular/core/testing';
import { BucketService } from '../bucket/bucket.service';
import { ColorApplicatorService } from '../color-applicator/color-applicator.service';
import { BrushService } from '../drawer/brush/brush.service';
import { FeatherService } from '../drawer/feather/feather.service';
import { PencilService } from '../drawer/pencil/pencil.service';
import { EraseService } from '../erase/erase.service';
import { LineService } from '../line/line.service';
import { PipetteService } from '../pipette/pipette.service';
import { RotationService } from '../selection/rotation.service';
import { SelectionService } from '../selection/selection.service';
import { EllipseService } from '../shape/ellipse/ellipse.service';
import { PolygonService } from '../shape/polygon/polygon.service';
import { RectangleService } from '../shape/rectangle/rectangle.service';
import { SprayService } from '../spray/spray.service';
import { TextService } from '../text/text.service';
import { ClickEventDispatcherService } from './click-event-dispatcher.service';

describe('ClickEventDispatcherService', () => {
  let rectangleService: RectangleService;
  let lineService: LineService;
  let brushService: BrushService;
  let pencilService: PencilService;
  let featherService: FeatherService;
  let textService: TextService;
  let dropperService: PipetteService;
  let sprayService: SprayService;
  let eraseService: EraseService;
  let applicatorService: ColorApplicatorService;
  let ellipseService: EllipseService;
  let polygonService: PolygonService;
  let bucketService: BucketService;
  let selectionService: SelectionService;
  let rotationService: RotationService;
  let clickEventDispatcherService: ClickEventDispatcherService;

  let event: MouseEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    rectangleService = TestBed.get(RectangleService);
    lineService = TestBed.get(LineService);
    brushService = TestBed.get(BrushService);
    pencilService = TestBed.get(PencilService);
    featherService = TestBed.get(FeatherService);
    textService = TestBed.get(TextService);
    dropperService = TestBed.get(PipetteService);
    sprayService = TestBed.get(SprayService);
    eraseService = TestBed.get(EraseService);
    applicatorService = TestBed.get(ColorApplicatorService);
    ellipseService = TestBed.get(EllipseService);
    polygonService = TestBed.get(PolygonService);
    bucketService = TestBed.get(BucketService);
    selectionService = TestBed.get(SelectionService);
    rotationService = TestBed.get(RotationService);
    clickEventDispatcherService = TestBed.get(ClickEventDispatcherService);
    event = new MouseEvent('', {});

  });

  it('should be created', () => {
    expect(clickEventDispatcherService).toBeTruthy();
  });

  // ---------- Mouse Down Event ---------------- //
  it('should not call the pencil service on mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'notpencil';
    const spy = spyOn(pencilService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call the pencil service on mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'pencil';
    const spy = spyOn(pencilService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the feather service on mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'feather';
    const spy = spyOn(featherService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the brush service on mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'brush';
    const spy = spyOn(brushService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the rectangle service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'rectangle';
    const spy = spyOn(rectangleService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the eraser service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'eraser';
    const spy = spyOn(eraseService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the applicator service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'applicator';
    const spy = spyOn(applicatorService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the ellipse service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'ellipse';
    const spy = spyOn(ellipseService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the polygon service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'polygon';
    const spy = spyOn(polygonService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the dropper service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'dropper';
    const spy = spyOn(dropperService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the spray service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'spray';
    const spy = spyOn(sprayService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the bucket service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'bucket';
    const spy = spyOn(bucketService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the selection service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    const spy = spyOn(selectionService, 'mouseDown');
    clickEventDispatcherService.mouseDown(event);
    expect(spy).toHaveBeenCalled();

  });

  // -------------- Mouse Click Event ------------------ //
  it('should not call the line service on mouseClick', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'notline';
    const spy = spyOn(lineService, 'mouseClick');
    clickEventDispatcherService.mouseClick(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call the line service on mouseClick', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'line';
    const spy = spyOn(lineService, 'mouseClick');
    clickEventDispatcherService.mouseClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the text service mouseClick', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'text';
    const spy = spyOn(textService, 'mouseClick');
    clickEventDispatcherService.mouseClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the erase service mouseClick', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'eraser';
    const spy = spyOn(eraseService, 'mouseClick');
    clickEventDispatcherService.mouseClick(event);
    expect(spy).toHaveBeenCalled();
  });

  // ------------- Mouse Move Event ------------------- //
  it('should not call the pencil service on mouseMove', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'not pencil';
    const spy = spyOn(pencilService, 'mouseMove');
    clickEventDispatcherService.mouseMove(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call the pencil service on mouseMove', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'pencil';
    const spy = spyOn(pencilService, 'mouseMove');
    clickEventDispatcherService.mouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the feather service on mouseMove', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'feather';
    const spy = spyOn(featherService, 'mouseMove');
    clickEventDispatcherService.mouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the brush service on mouseMove', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'brush';
    const spy = spyOn(brushService, 'mouseMove');
    clickEventDispatcherService.mouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the rectangle service on mouseMove', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'rectangle';
    const spy = spyOn(rectangleService, 'mouseMove');
    clickEventDispatcherService.mouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the line service on mouseMove', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'line';
    const spy = spyOn(lineService, 'mouseMove');
    clickEventDispatcherService.mouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the spray service on mouseMove', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'spray';
    const spy = spyOn(sprayService, 'mouseMove');
    clickEventDispatcherService.mouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the selection service on mouseMove', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    const spy = spyOn(selectionService, 'mouseMove');
    clickEventDispatcherService.mouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the eraser service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'eraser';
    const spy = spyOn(eraseService, 'mouseMove');
    clickEventDispatcherService.mouseMove(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the ellipse service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'ellipse';
    const spy = spyOn(ellipseService, 'mouseMove');
    clickEventDispatcherService.mouseMove(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the polygon service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'polygon';
    const spy = spyOn(polygonService, 'mouseMove');
    clickEventDispatcherService.mouseMove(event);
    expect(spy).toHaveBeenCalled();

  });

  // --------------- Mouse Up Event -----------------------//
  it('should call the pencil service on mouseUp', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'pencil';
    const spy = spyOn(pencilService, 'mouseUp');
    clickEventDispatcherService.mouseUp(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should not call the pencil service on mouseUp', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'not pencil';
    const spy = spyOn(pencilService, 'mouseUp');
    clickEventDispatcherService.mouseUp(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call the feather service on mouseUp', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'feather';
    const spy = spyOn(featherService, 'mouseUp');
    clickEventDispatcherService.mouseUp(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the brush service on mouseUp', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'brush';
    const spy = spyOn(brushService, 'mouseUp');
    clickEventDispatcherService.mouseUp(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the selection service on mouseUp', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    const spy = spyOn(selectionService, 'mouseUp');
    clickEventDispatcherService.mouseUp(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the rectangle service on mouseUp', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'rectangle';
    const spy = spyOn(rectangleService, 'mouseUp');
    clickEventDispatcherService.mouseUp(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the spray service on mouseUp', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'spray';
    const spy = spyOn(sprayService, 'mouseUp');
    clickEventDispatcherService.mouseUp(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the eraser service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'eraser';
    const spy = spyOn(eraseService, 'mouseUp');
    clickEventDispatcherService.mouseUp(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the ellipse service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'ellipse';
    const spy = spyOn(ellipseService, 'mouseUp');
    clickEventDispatcherService.mouseUp(event);
    expect(spy).toHaveBeenCalled();

  });

  it('should call the polygon service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'polygon';
    const spy = spyOn(polygonService, 'mouseUp');
    clickEventDispatcherService.mouseUp(event);
    expect(spy).toHaveBeenCalled();

  });

  // -------------- Mouse Double Click Event -------------//
  it('should call the line service on dblclick', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'line';
    const spy = spyOn(lineService, 'mouseDoubleClick');
    clickEventDispatcherService.mouseDbClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should not call the line service on dblclick', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'not line';
    const spy = spyOn(lineService, 'mouseDoubleClick');
    clickEventDispatcherService.mouseDbClick(event);
    expect(spy).not.toHaveBeenCalled();
  });

  // ------------ Mouse Leave Event -------------------- //
  it('should call the pencil service on mouseLeave', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'pencil';
    const spy = spyOn(pencilService, 'mouseLeave');
    clickEventDispatcherService.mouseLeave();
    expect(spy).toHaveBeenCalled();
  });

  it('should call the feather service on mouseLeave', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'feather';
    const spy = spyOn(featherService, 'mouseLeave');
    clickEventDispatcherService.mouseLeave();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call the pencil service on mouseLeave', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'not pencil';
    const spy = spyOn(pencilService, 'mouseLeave');
    clickEventDispatcherService.mouseLeave();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call the brush service on mouseLeave', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'brush';
    const spy = spyOn(brushService, 'mouseLeave');
    clickEventDispatcherService.mouseLeave();
    expect(spy).toHaveBeenCalled();
  });

  it('should call the rectangle service on mouseLeave', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'rectangle';
    const spy = spyOn(rectangleService, 'mouseLeave');
    clickEventDispatcherService.mouseLeave();
    expect(spy).toHaveBeenCalled();
  });

  it('should call the eraser service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'eraser';
    const spy = spyOn(eraseService, 'mouseLeave');
    clickEventDispatcherService.mouseLeave();
    expect(spy).toHaveBeenCalled();

  });

  it('should call the ellipse service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'ellipse';
    const spy = spyOn(ellipseService, 'mouseLeave');
    clickEventDispatcherService.mouseLeave();
    expect(spy).toHaveBeenCalled();

  });

  it('should call the polygon service mouseDown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'polygon';
    const spy = spyOn(polygonService, 'mouseLeave');
    clickEventDispatcherService.mouseLeave();
    expect(spy).toHaveBeenCalled();

  });

  // ---------------- Set Current Tool -----------------//
  it('should set the clickEventDispatchers currentTool', () => {
    const currentTool = 'currentTool';
    const tool = 'newTool';
    clickEventDispatcherService[currentTool] = 'oldTool';
    clickEventDispatcherService.setCurrentTool(tool);
    expect(clickEventDispatcherService[currentTool]).toBe(tool);
  });

  // --------------- Call HotKey ----------------------- //
  // ----- Rectangle
  it('Should call the rectangle shift hotkeydown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'rectangle';
    const spy = spyOn(rectangleService, 'shiftkeyDownCall');
    clickEventDispatcherService.hotKeysDown('Shift');
    expect(spy).toHaveBeenCalled();
  });

  it('Should not call the rectangle shift hotkeydown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'rectangle';
    const spy = spyOn(rectangleService, 'shiftkeyDownCall');
    clickEventDispatcherService.hotKeysDown('c');
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should not call a hotkeydown methode of any service' , () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = '';
    const spy = spyOn(rectangleService, 'shiftkeyDownCall');
    clickEventDispatcherService.hotKeysDown('Shift');
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should call the rectangle shift hotkeyUp', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'rectangle';
    const spy = spyOn(rectangleService, 'shiftkeyUpCall');
    clickEventDispatcherService.hotKeysUp('Shift');
    expect(spy).toHaveBeenCalled();
  });

  it('Should not call the rectangle shift hotkeyUp', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'rectangle';
    const spy = spyOn(rectangleService, 'shiftkeyUpCall');
    clickEventDispatcherService.hotKeysUp('c');
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should not call a hotkeyUp methode of any service' , () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = '';
    const spy = spyOn(rectangleService, 'shiftkeyUpCall');
    clickEventDispatcherService.hotKeysUp('Shift');
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should not call a hotkeyUp methode of selection' , () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    clickEventDispatcherService.hotKeysUp('ArrowRight');
    expect(selectionService.hotkeys.get('ArrowRight')).toEqual(false);
  });

  // ------- LineService
  it('Should call the lineService shift hotkeydown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'line';
    const spy = spyOn(lineService, 'shiftkeyDownCall');
    clickEventDispatcherService.hotKeysDown('Shift');
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the lineService backspace hotkeydown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'line';
    const spy = spyOn(lineService, 'backspacekeyDownCall');
    clickEventDispatcherService.hotKeysDown('Backspace');
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the lineService escape hotkeydown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'line';
    const spy = spyOn(lineService, 'escapekeyDownCall');
    clickEventDispatcherService.hotKeysDown('Escape');
    expect(spy).toHaveBeenCalled();
  });

  it('Should no call a hotkeyDown methode of any service', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = '';
    const spyShift = spyOn(lineService, 'shiftkeyDownCall');
    const spyBackspace = spyOn(lineService, 'backspacekeyDownCall');
    const spyEscape = spyOn(lineService, 'escapekeyDownCall');
    clickEventDispatcherService.hotKeysDown('Shift');
    expect(spyShift).not.toHaveBeenCalled();
    expect(spyEscape).not.toHaveBeenCalled();
    expect(spyBackspace).not.toHaveBeenCalled();
  });

  it('Should call a hotkeyUp methode of lineService' , () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'line';
    const spy = spyOn(lineService, 'shiftkeyUpCall');
    clickEventDispatcherService.hotKeysUp('Shift');
    expect(spy).toHaveBeenCalled();
  });

  it('Should not call a hotkeyUp methode of any service' , () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = '';
    const spy = spyOn(lineService, 'shiftkeyUpCall');
    clickEventDispatcherService.hotKeysUp('Shift');
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should not call a hotkeyUp methode of lineService' , () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'line';
    const spy = spyOn(lineService, 'shiftkeyUpCall');
    clickEventDispatcherService.hotKeysUp('');
    expect(spy).not.toHaveBeenCalled();
  });

  // -------- Ellipse
  it('Should call the ellipse shift hotkeydown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'ellipse';
    const spy = spyOn(ellipseService, 'shiftkeyDownCall');
    clickEventDispatcherService.hotKeysDown('Shift');
    expect(spy).toHaveBeenCalled();
  });

  it('Should not call the rectangle shift hotkeydown', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'ellipse';
    const spy = spyOn(ellipseService, 'shiftkeyDownCall');
    clickEventDispatcherService.hotKeysDown('c');
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should call the ellipse shift hotkeyup', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'ellipse';
    const spy = spyOn(ellipseService, 'shiftkeyUpCall');
    clickEventDispatcherService.hotKeysUp('Shift');
    expect(spy).toHaveBeenCalled();
  });

  it('Should not call the rectangle shift hotkeyup', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'ellipse';
    const spy = spyOn(ellipseService, 'shiftkeyUpCall');
    clickEventDispatcherService.hotKeysUp('c');
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should call the selectAll ', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    const spy = spyOn(selectionService, 'selectAllItems');
    clickEventDispatcherService.selectAllItems();
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the selectAll ', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'notselection';
    const spy = spyOn(selectionService, 'selectAllItems');
    clickEventDispatcherService.selectAllItems();
    expect(spy).not.toHaveBeenCalled();
  });

  // -------- Selection
  it('Should call the selection hotkeydown first if', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    const spy = spyOn(selectionService, 'keyboardTransformation');
    clickEventDispatcherService.hotKeysDown('ArrowLeft');
    expect(selectionService.hotkeys.get('firstTranslationHold')).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the selection hotkeydown shift', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    selectionService.shiftKey = false;
    const spy = spyOn(selectionService, 'updateSelectedItemsRotationAxisAndInitPos');
    clickEventDispatcherService.hotKeysDown('Shift');
    expect(spy).toHaveBeenCalled();
  });
  it('Should call the selection hotkeyp shift', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    selectionService.shiftKey = false;
    const spy = spyOn(rotationService, 'updateSelectedItemsInitPosBeforeRotation');
    clickEventDispatcherService.hotKeysUp('Shift');
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the selection hotkeydown second if', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    selectionService.hotkeys.set('firstTranslationHold', true);
    selectionService.hotkeys.set('ArrowUp', true);
    const spyTimeout = spyOn(global, 'setTimeout');
    clickEventDispatcherService.hotKeysDown('ArrowLeft');
    expect(selectionService.hotkeys.get('firstTranslationHold')).toBe(false);
    expect(selectionService.hotkeys.get('ArrowLeft')).toBe(true);
    expect(spyTimeout).toHaveBeenCalled();
  });

  it('Should call rotatateSelection', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    selectionService.selectionParameters.firstRotation = true;
    clickEventDispatcherService.rotateSelection(0, true);
    expect(selectionService.selectionParameters.firstRotation).toBe(false);
  });
  it('Should call rotatateSelection second if', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'not selection';
    const spy = spyOn(rotationService, 'rotateSelection');
    clickEventDispatcherService.rotateSelection(0, true);
    expect(spy).not.toHaveBeenCalled();
  });
  it('Should call rotatateSelection third if', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    selectionService.selectionParameters.firstRotation = false;
    const spy = spyOn(rotationService, 'rotateSelection');
    clickEventDispatcherService.rotateSelection(0, true);
    expect(spy).toHaveBeenCalled();
  });
  it('Should call the selection hotkeydown third if', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'selection';
    selectionService.hotkeys.set('firstTranslationHold', false);
    selectionService.hotkeys.set('ArrowUp', true);
    const spy = spyOn(selectionService, 'keyboardTransformation');
    clickEventDispatcherService.hotKeysDown('ArrowLeft');
    expect(selectionService.hotkeys.get('ArrowLeft')).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the textService backspace', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'text';
    const spy = spyOn(textService, 'deletePreviousCaracter');
    clickEventDispatcherService.hotKeysDown('Backspace');
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the textService escape', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'text';
    const spy = spyOn(textService, 'cancelEdition');
    clickEventDispatcherService.hotKeysDown('Escape');
    expect(spy).toHaveBeenCalled();
  });
  it('Should call the textService Delete', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'text';
    const spy = spyOn(textService, 'deleteNextCaracter');
    clickEventDispatcherService.hotKeysDown('Delete');
    expect(spy).toHaveBeenCalled();
  });
  it('Should call the textService Enter', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'text';
    const spy = spyOn(textService, 'changeLine');
    clickEventDispatcherService.hotKeysDown('Enter');
    expect(spy).toHaveBeenCalled();
  });
  it('Should call the textService ArrowLeft', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'text';
    const spy = spyOn(textService, 'moveLeftText');
    clickEventDispatcherService.hotKeysDown('ArrowLeft');
    expect(spy).toHaveBeenCalled();
  });
  it('Should call the textService ArrowRight', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'text';
    const spy = spyOn(textService, 'moveRightText');
    clickEventDispatcherService.hotKeysDown('ArrowRight');
    expect(spy).toHaveBeenCalled();
  });
  it('Should call the textService Down', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'text';
    const spy = spyOn(textService, 'moveDownText');
    clickEventDispatcherService.hotKeysDown('ArrowDown');
    expect(spy).toHaveBeenCalled();
  });
  it('Should call the textService Up', () => {
    const currentTool = 'currentTool';
    clickEventDispatcherService[currentTool] = 'text';
    const spy = spyOn(textService, 'moveUpText');
    clickEventDispatcherService.hotKeysDown('ArrowUp');
    expect(spy).toHaveBeenCalled();
  });
// Garder les tests dans un seul fichier
// tslint:disable-next-line: max-file-line-count
});


import { APP_BASE_HREF } from '@angular/common';
import { DebugElement, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { TESTDRAWING } from '../gallery/drawing/enum';
import { DrawZoneComponent } from './draw-zone.component';

describe('DrawZoneComponent', () => {
  let component: DrawZoneComponent;
  let fixture: ComponentFixture<DrawZoneComponent>;
  let mockCEDS: ClickEventDispatcherService;
  let svg: DebugElement;
  let mockRenderer: Renderer2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}, ClickEventDispatcherService],
      imports: [AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    localStorage.removeItem(AUTOSAVE.LOCATION);
    fixture = TestBed.createComponent(DrawZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Retrieve svg element from HTML
    svg = fixture.debugElement.query(By.css('.drawView'));
    mockCEDS = fixture.debugElement.injector.get(ClickEventDispatcherService);
    // tslint:disable-next-line: deprecation
    mockRenderer = fixture.debugElement.injector.get(Renderer2);
  });

  it('should create', () => {
     expect(component).toBeTruthy();
   });

  it('should call mouseDown of clickEventDispatcher', () => {
    spyOn(mockCEDS, 'mouseDown').and.callThrough();
    svg.triggerEventHandler('mousedown', {});
    expect(mockCEDS.mouseDown).toHaveBeenCalled();
  });

  it('should call mouseUp of clickEventDispatcher', () => {
    spyOn(mockCEDS, 'mouseUp').and.callThrough();
    svg.triggerEventHandler('mouseup', {});
    expect(mockCEDS.mouseUp).toHaveBeenCalled();
  });

  it('should call mouseMove of clickEventDispatcher', () => {
    spyOn(mockCEDS, 'mouseMove').and.callThrough();
    svg.triggerEventHandler('mousemove', {});
    expect(mockCEDS.mouseMove).toHaveBeenCalled();
  });

  it('should call mouseLeave of clickEventDispatcher', () => {
    spyOn(mockCEDS, 'mouseLeave').and.callThrough();
    svg.triggerEventHandler('mouseleave', {});
    expect(mockCEDS.mouseLeave).toHaveBeenCalled();
  });

  it('should call mouseClick of clickEventDispatcher', () => {
    spyOn(mockCEDS, 'mouseClick').and.callThrough();
    svg.triggerEventHandler('click', {});
    expect(mockCEDS.mouseClick).toHaveBeenCalled();
  });

  it('should call mouseDbClick of clickEventDispatcher', () => {
    spyOn(mockCEDS, 'mouseDbClick').and.callThrough();
    svg.triggerEventHandler('dblclick', {});
    expect(mockCEDS.mouseDbClick).toHaveBeenCalled();
  });

  it('should call mouseRightDown', () => {
    spyOn(component, 'mouseRightDown').and.callThrough();
    svg.triggerEventHandler('contextmenu', {});
    expect(component.mouseRightDown).toHaveBeenCalled();
  });

  it('Should not open a dialog for a new drawing', () => {
    mockCEDS.popUpActive = true;
    const spy = spyOn(component, 'openDialogCreateDrawZone').and.callThrough();
    component.hotkeyNewDrawing(new KeyboardEvent('', undefined));
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('Should open a dialog for a new drawing', () => {
    mockCEDS.popUpActive = false;
    const spy = spyOn(component, 'openDialogCreateDrawZone').and.callThrough();
    component.hotkeyNewDrawing(new KeyboardEvent('', undefined));
    expect(spy).toHaveBeenCalled();
  });

  it('Should remove child', () => {
    const spy = spyOn(mockRenderer, 'removeChild').and.callThrough();
    // mockCEDS.canvas = null;
    component.openDialogCreateDrawZone(false);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('Should remove canvas', async(() => {
    const dialogRef = 'dialogRefCreate';
    const workZone = 'newWorkZone';
    // Set a canva
    mockCEDS.canvas = mockRenderer.createElement('svg', 'http://www.w3.org/2000/svg');
    mockRenderer.appendChild(component.drawView.nativeElement, mockCEDS.canvas);
    // Call fonction
    component.openDialogCreateDrawZone(false);
    const spy = spyOn(mockRenderer, 'appendChild').and.callFake( () => { return; } );
    // Set the data
    const newDrawingComponent = component[dialogRef].componentInstance;
    const hundred = 100;
    newDrawingComponent[workZone].width = hundred;
    newDrawingComponent[workZone].height = hundred;
    // Close the pop up
    newDrawingComponent.save();
    fixture.detectChanges();
    // Wait and check if propely exec
    component[dialogRef].afterClosed().subscribe( () => {
    expect(spy).toHaveBeenCalled();
    });
  }));

  it('Should not remove canvas since there no canvas', async(() => {
    const dialogRef = 'dialogRefCreate';
    const workZone = 'newWorkZone';
    const undoRedoService = 'undoRedo';
    const autoSaveService = 'autoSave';
    // Call fonction
    component.openDialogCreateDrawZone(false);
    // Set fake fonction since textureComponent is not initialise
    const spy = spyOn(mockRenderer, 'appendChild').and.callFake( () => { return; });
    spyOn(component[undoRedoService], 'setElement').and.callFake( () => { return; });
    spyOn(component[undoRedoService], 'enable').and.callFake( () => { return; });
    spyOn(component[autoSaveService], 'setElement').and.callFake( () => { return; });
    // Set the data
    const newDrawingComponent = component[dialogRef].componentInstance;
    const hundred = 100;
    newDrawingComponent[workZone].width = hundred;
    newDrawingComponent[workZone].height = hundred;
    // Close the pop up
    newDrawingComponent.save();
    fixture.detectChanges();
    // Wait and check if propely exec
    component[dialogRef].afterClosed().subscribe( () => {
    expect(spy).toHaveBeenCalled();
    });
  }));

  it('Should not remove canvas since data is null', async(() => {
    const dialogRef = 'dialogRefCreate';
    // Call fonction
    component.openDialogCreateDrawZone(false);
    const spy = spyOn(mockRenderer, 'setAttribute').and.callThrough();
    // Close the pop up
    component[dialogRef].close();
    fixture.detectChanges();
    // Wait and check if propely exec
    component[dialogRef].afterClosed().subscribe( () => {
        expect(spy).not.toHaveBeenCalled();
    });
  }));

  it('Should resume the drawing ', async(() => {
    localStorage.setItem(AUTOSAVE.LOCATION, TESTDRAWING.DRAWING);
    fixture = TestBed.createComponent(DrawZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockCEDS = fixture.debugElement.injector.get(ClickEventDispatcherService);
    // tslint:disable-next-line: deprecation
    mockRenderer = fixture.debugElement.injector.get(Renderer2);
    localStorage.setItem('drawingSvg', TESTDRAWING.DRAWING);
    const spyCanvasCreate = spyOn(mockRenderer, 'createElement').and.callThrough();
    component.resumeDrawing();
    expect(spyCanvasCreate).toHaveBeenCalled();
  }));

  it('Should remove canvas', async(() => {
    localStorage.setItem(AUTOSAVE.LOCATION, TESTDRAWING.DRAWING);
    fixture = TestBed.createComponent(DrawZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockCEDS = fixture.debugElement.injector.get(ClickEventDispatcherService);
    // tslint:disable-next-line: deprecation
    mockRenderer = fixture.debugElement.injector.get(Renderer2);
    const dialogRef = 'dialogRefCreate';
    const workZone = 'newWorkZone';
    // Set a canva
    mockCEDS.canvas = mockRenderer.createElement('svg', 'http://www.w3.org/2000/svg');
    mockRenderer.appendChild(component.drawView.nativeElement, mockCEDS.canvas);
    // Call fonction
    component.openDialogCreateDrawZone(false);
    const spy = spyOn(mockRenderer, 'appendChild').and.callFake( () => { return; } );
    // Set the data
    const newDrawingComponent = component[dialogRef].componentInstance;
    const hundred = 100;
    newDrawingComponent[workZone].width = hundred;
    newDrawingComponent[workZone].height = hundred;
    // Close the pop up
    newDrawingComponent.save();
    fixture.detectChanges();
    // Wait and check if propely exec
    component[dialogRef].afterClosed().subscribe( () => {
    expect(spy).toHaveBeenCalled();
    });
  }));

});

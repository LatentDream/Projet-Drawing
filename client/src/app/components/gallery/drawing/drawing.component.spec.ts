import { APP_BASE_HREF } from '@angular/common';
import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { QueriesService } from 'src/app/services/serverInteraction/queries.service';
import { Drawing } from '../../../../../../common/communication/drawing';
import { DrawingComponent } from './drawing.component';
import { TESTDRAWING } from './enum';

describe('DrawingComponent', () => {
  let component: DrawingComponent;
  let fixture: ComponentFixture<DrawingComponent>;
  let mockQS: QueriesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/my/app' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockQS = fixture.debugElement.injector.get(QueriesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Shoud set the drawing info', () => {
    const spy = spyOn(component, 'svgToCanvas');
    const drawing: Drawing = {
      _id: TESTDRAWING.ID,
      name: TESTDRAWING.NAME,
      tags: [TESTDRAWING.TAGS],
      drawing: TESTDRAWING.DRAWING
    };
    component.info = drawing;
    const change: SimpleChanges = {};
    component.ngOnChanges(change);
    expect(spy).toHaveBeenCalled();
  });

  it('Should load the drawing in the canvas', () => {
    const drawing: Drawing = {
      _id: TESTDRAWING.ID,
      name: TESTDRAWING.NAME,
      tags: [TESTDRAWING.TAGS],
      drawing: TESTDRAWING.DRAWING
    };
    component.info = drawing;
    component.svgToCanvas();
    expect(component.targetCanvas.nativeElement).not.toEqual(null);
  });

  it('Should load the drawing in the draw zone 1', async(() => {
    const spy = spyOn(localStorage, 'setItem');
    const drawing: Drawing = {
      _id: TESTDRAWING.ID,
      name: TESTDRAWING.NAME,
      tags: [TESTDRAWING.TAGS],
      drawing: TESTDRAWING.DRAWING
    };
    component.info = drawing;
    component.svgToCanvas();
    localStorage.removeItem(AUTOSAVE.LOCATION);
    component.loadToDrawingZone();
    expect(spy).toHaveBeenCalled();
  }));

  it('Should load the drawing in the draw zone 2', async(() => {
    localStorage.removeItem(AUTOSAVE.LOCATION);
    localStorage.setItem(AUTOSAVE.LOCATION, component.info.drawing);
    const spy = spyOn(localStorage, 'setItem');
    const drawing: Drawing = {
      _id: TESTDRAWING.ID,
      name: TESTDRAWING.NAME,
      tags: [TESTDRAWING.TAGS],
      drawing: TESTDRAWING.DRAWING
    };
    component.info = drawing;
    component.loadToDrawingZone();
    const dialogRef = 'dialogRefDelete';
    component[dialogRef].componentInstance.confirm();
    component[dialogRef].afterClosed().subscribe( () => {
      expect(spy).toHaveBeenCalled();
      });
  }));

  it('Should not load the drawing in the draw zone', async(() => {
    localStorage.removeItem(AUTOSAVE.LOCATION);
    localStorage.setItem(AUTOSAVE.LOCATION, component.info.drawing);
    const spy = spyOn(localStorage, 'setItem');
    const drawing: Drawing = {
      _id: TESTDRAWING.ID,
      name: TESTDRAWING.NAME,
      tags: [TESTDRAWING.TAGS],
      drawing: TESTDRAWING.DRAWING
    };
    component.info = drawing;
    component.loadToDrawingZone();
    const dialogRef = 'dialogRefDelete';
    component[dialogRef].componentInstance.close();
    component[dialogRef].afterClosed().subscribe( () => {
      expect(spy).not.toHaveBeenCalled();
      });
  }));

  it('Should not delete the drawing', async(() => {
    const spy = spyOn(mockQS, 'deleteDrawing');
    const drawing: Drawing = {
      _id: TESTDRAWING.ID,
      name: TESTDRAWING.NAME,
      tags: [TESTDRAWING.TAGS],
      drawing: TESTDRAWING.DRAWING
    };
    component.info = drawing;
    component.delete();
    const dialogRef = 'dialogRefDelete';
    component[dialogRef].componentInstance.close();
    component[dialogRef].afterClosed().subscribe( () => {
      expect(spy).not.toHaveBeenCalled();
      });
  }));

  it('Should delete the drawing', async(() => {
    const spy = spyOn(mockQS, 'deleteDrawing').and.callThrough();
    const drawing: Drawing = {
      _id: TESTDRAWING.ID,
      name: TESTDRAWING.NAME,
      tags: [TESTDRAWING.TAGS],
      drawing: TESTDRAWING.DRAWING
    };
    component.info = drawing;
    component.delete();
    const dialogRef = 'dialogRefDelete';
    component[dialogRef].componentInstance.confirm();
    component[dialogRef].afterClosed().subscribe( () => {
      expect(spy).toHaveBeenCalled();
      });
  }));
});

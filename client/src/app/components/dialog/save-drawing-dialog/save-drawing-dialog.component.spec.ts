import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialogRef } from '@angular/material';
import { AppModule } from 'src/app/app.module';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { QueriesService } from 'src/app/services/serverInteraction/queries.service';
import { TESTDRAWING } from '../../gallery/drawing/enum';
import { SaveDrawingDialogComponent, Tag } from './save-drawing-dialog.component';

describe('SaveDrawingDialogComponent', () => {
  let component: SaveDrawingDialogComponent;
  let fixture: ComponentFixture<SaveDrawingDialogComponent>;
  let mockQS: QueriesService;

  const mockDialog = {
    close: () => { return; }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/my/app' },
      { provide: MatDialogRef, useValue: mockDialog },
      { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem(AUTOSAVE.LOCATION, TESTDRAWING.DRAWING);
    fixture = TestBed.createComponent(SaveDrawingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a component without preview', () => {
    const fixtureNoPreview = TestBed.createComponent(SaveDrawingDialogComponent);
    fixtureNoPreview.detectChanges();
    expect(fixtureNoPreview.componentInstance).toBeTruthy();
  });

  it('should add the tag', () => {
    component.tags = [];
    const inputHTML = fixture.debugElement.nativeElement.querySelector('.input');
    const event: MatChipInputEvent = {
      input: inputHTML,
      value: 'test'
    };
    component.add(event);
    expect(component.tags.length).toEqual(1);
  });

  it('shoud alert the user that the tag is to long', () => {
    const spy = spyOn(component.tags, 'push');
    component.tags = [];
    const inputHTML = fixture.debugElement.nativeElement.querySelector('.input');
    const event: MatChipInputEvent = {
      input: inputHTML,
      value: 'TROPDELETTRESPOURINPUT'
    };
    component.add(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('shoud not add a empty tag', () => {
    component.tags = [];
    const inputHTML = fixture.debugElement.nativeElement.querySelector('.input');
    const event: MatChipInputEvent = {
      input: inputHTML,
      value: ''
    };
    component.add(event);
    expect(component.tags.length).toEqual(0);
  });

  it('shoud remove the tag', () => {
    const tag1: Tag = { name:  TESTDRAWING.TAGS};
    component.tags = [tag1];
    component.remove(tag1);
    expect(component.tags.length).toEqual(0);
  });

  it('shoud not remove the tag', () => {
    const tag1: Tag = { name:  TESTDRAWING.TAGS};
    const tag2: Tag = { name: ''};
    component.tags = [tag1];
    component.remove(tag2);
    expect(component.tags.length).toEqual(1);
    component.close();
  });

  it('shoud save the drawing', () => {
    mockQS = fixture.debugElement.injector.get(QueriesService);
    component.drawingName = TESTDRAWING.NAME;
    component.tags = [{ name: TESTDRAWING.TAGS}];
    component.srxCanvas = TESTDRAWING.DRAWING;
    const spy = spyOn(mockQS, 'sendDrawingData').and.returnValue(new Promise((resolve) => {resolve(''); }));
    component.save();
    expect(spy).toHaveBeenCalled();
  });

  it('shoud alert the user about the error', () => {
    mockQS = fixture.debugElement.injector.get(QueriesService);
    component.drawingName = 'NAMETOOLONGFORTHEDRAWINGNAME';
    component.tags = [{ name: TESTDRAWING.TAGS}];
    component.srxCanvas = TESTDRAWING.DRAWING;
    const spy = spyOn(mockQS, 'sendDrawingData').and.returnValue(new Promise((resolve) => {resolve(''); }));
    component.save();
    expect(spy).not.toHaveBeenCalled();
  });
});

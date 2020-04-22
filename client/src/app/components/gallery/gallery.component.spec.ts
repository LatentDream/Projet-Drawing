import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipInputEvent, MatDialog } from '@angular/material';
import { AppModule } from 'src/app/app.module';
import { QueriesService } from 'src/app/services/serverInteraction/queries.service';
import { Drawing } from '../../../../../common/communication/drawing';
import { Tag } from '../dialog/save-drawing-dialog/save-drawing-dialog.component';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  const mockLoc = jasmine.createSpyObj('Location', ['back', 'subscribe']);
  let mockQS: QueriesService;
  let mockDialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/my/app' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockQS = fixture.debugElement.injector.get(QueriesService);
    mockDialog = fixture.debugElement.injector.get(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Shoud go back to the previous page', () => {
    const ug = new GalleryComponent(mockQS, mockLoc, mockDialog);
    ug.backPage();
    expect(mockLoc.back).toHaveBeenCalledTimes(1);
  });

  it('Shoud empty drawingsdata array', () => {
    const  d: Drawing = {_id: 'test', name: 'test', tags: [], drawing: 'test'};
    component.drawingsData = [d];
    component.emptyDrawing();
    expect(component.drawingsData.length).toEqual(0);
  });

  it('Shoud add a drawing to the preview', () => {
    const  d1: Drawing = {_id: 'test1', name: 'test1', tags: ['test1'], drawing: 'test1'};
    const  d2: Drawing = {_id: 'test2', name: 'test2', tags: ['test2'], drawing: 'test2'};
    component.backupDrawingsData = [d1, d2];
    component.filter('test1');
    expect(component.drawingsData.length).toEqual(1);
    component.filter('test1');
    expect(component.drawingsData.length).toEqual(1);
    component.filter('test2');
    expect(component.drawingsData.length).toEqual(2);
    component.filter('test2');
    expect(component.drawingsData.length).toEqual(2);
  });

  it('Should remove the drawing from the preview', () => {
    const  d2: Drawing = {_id: 'test2', name: 'test2', tags: ['test2'], drawing: 'test2'};
    const  d1: Drawing = {_id: 'test1', name: 'test1', tags: ['test1'], drawing: 'test1'};
    component.backupDrawingsData = [d1, d2];
    component.drawingsData = [d1, d2];
    const tag1: Tag = { name: 'test1'};
    const tag2: Tag = { name: 'test2'};
    component.tags = [tag1, tag2];
    component.remove(tag1);
    expect(component.drawingsData.length).toEqual(1);
  });

  it('Should not remove the drawing from the preview', () => {
    const  d2: Drawing = {_id: 'test2', name: 'test2', tags: ['test2'], drawing: 'test2'};
    const  d1: Drawing = {_id: 'test1', name: 'test1', tags: ['test1', 'test2'], drawing: 'test1'};
    component.backupDrawingsData = [d1, d2];
    component.drawingsData = [d1, d2];
    const tag1: Tag = { name: 'test1'};
    const tag2: Tag = { name: 'test2'};
    component.tags = [tag1, tag2];
    component.remove(tag1);
    expect(component.drawingsData.length).toEqual(2);
  });

  it('Should do nothing with a wrong tag', () => {
    const  d2: Drawing = {_id: 'test2', name: 'test2', tags: ['test2'], drawing: 'test2'};
    const  d1: Drawing = {_id: 'test1', name: 'test1', tags: ['test1', 'test2'], drawing: 'test1'};
    component.backupDrawingsData = [d1, d2];
    component.drawingsData = [d1, d2];
    const tag1: Tag = { name: 'test1'};
    const tag2: Tag = { name: 'test2'};
    const tag3: Tag = { name: 'test3'};
    component.tags = [tag1, tag2];
    component.remove(tag3);
    expect(component.drawingsData.length).toEqual(2);
  });

  it('Should alert the user that no drawing corespond to the tags', () => {
    const spy = spyOn(component, 'openAlert');
    const  d1: Drawing = {_id: 'test1', name: 'test1', tags: ['test1'], drawing: 'test1'};
    component.backupDrawingsData = [d1];
    component.drawingsData = [d1];
    const tag1: Tag = { name: 'test1'};
    const tag2: Tag = { name: 'test2'};
    component.tags = [tag1, tag2];
    component.remove(tag1);
    expect(spy).toHaveBeenCalled();
  });

  it('Should display all preview with when no tags', () => {
    const  d2: Drawing = {_id: 'test2', name: 'test2', tags: ['test2'], drawing: 'test2'};
    const  d1: Drawing = {_id: 'test1', name: 'test1', tags: ['test1', 'test2'], drawing: 'test1'};
    component.backupDrawingsData = [d1, d2];
    component.drawingsData = [d1, d2];
    const tag1: Tag = { name: 'test1'};
    const tag2: Tag = { name: 'test2'};
    component.tags = [tag1, tag2];
    component.remove(tag1);
    component.remove(tag2);
    expect(component.drawingsData.length).toEqual(2);
  });

  it('shoud add a tag', () => {
    component.tags = [];
    const inputHTML = fixture.debugElement.nativeElement.querySelector('.input');
    const event: MatChipInputEvent = {
      input: inputHTML,
      value: 'test'
    };
    component.add(event);
    expect(component.tags.length).toEqual(1);
  });

  it('shoud add a tag', () => {
    const spy = spyOn(component, 'openAlert');
    const  d1: Drawing = {_id: 'test1', name: 'test1', tags: ['test1'], drawing: 'test1'};
    component.drawingsData = [d1];
    const tag1: Tag = { name: 'test1'};
    component.tags = [tag1];
    const inputHTML = fixture.debugElement.nativeElement.querySelector('.input');
    const event: MatChipInputEvent = {
      input: inputHTML,
      value: 'test1'
    };
    component.add(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('shoud not add a tag', () => {
    component.tags = [];
    const inputHTML = fixture.debugElement.nativeElement.querySelector('.input');
    const event: MatChipInputEvent = {
      input: inputHTML,
      value: ''
    };
    component.add(event);
    expect(component.tags.length).toEqual(0);
  });

  it('shoud alert the user that these no drawing found', () => {
    const spy = spyOn(component, 'openAlert');
    component.tags = [];
    component.drawingsData = [];
    const inputHTML = fixture.debugElement.nativeElement.querySelector('.input');
    const event: MatChipInputEvent = {
      input: inputHTML,
      value: 'test'
    };
    component.add(event);
    expect(spy).toHaveBeenCalled();
  });

  it('shoud alert the user that the tag is to long', () => {
    const spy = spyOn(component, 'openAlert');
    component.tags = [];
    component.drawingsData = [];
    const inputHTML = fixture.debugElement.nativeElement.querySelector('.input');
    const event: MatChipInputEvent = {
      input: inputHTML,
      value: 'TROPDELETTRESPOURINPUT'
    };
    component.add(event);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('shoud delete the drawing localy', () => {
    const  d1: Drawing = {_id: 'test1', name: 'test1', tags: ['test1'], drawing: 'test1'};
    const  d2: Drawing = {_id: 'test2', name: 'test2', tags: ['test2'], drawing: 'test2'};
    component.backupDrawingsData = [d1, d2];
    component.drawingsData = [d1, d2];
    component.deleteDrawingLocaly('test1');
    expect(component.backupDrawingsData.length).toEqual(1);
  });

  it('shoud delete the drawing localy', () => {
    const  d1: Drawing = {_id: 'test1', name: 'test1', tags: ['test1'], drawing: 'test1'};
    const  d2: Drawing = {_id: 'test2', name: 'test2', tags: ['test2'], drawing: 'test2'};
    component.backupDrawingsData = [d1, d2];
    component.drawingsData = [d2];
    component.deleteDrawingLocaly('test1');
    expect(component.drawingsData.length).toEqual(1);
  });

  it('shoud delete nothing with a wrong id', () => {
    const  d1: Drawing = {_id: 'test1', name: 'test1', tags: ['test1'], drawing: 'test1'};
    const  d2: Drawing = {_id: 'test2', name: 'test2', tags: ['test2'], drawing: 'test2'};
    component.backupDrawingsData = [d1, d2];
    component.drawingsData = [d1, d2];
    component.deleteDrawingLocaly('test');
    expect(component.drawingsData.length).toEqual(2);
  });

});

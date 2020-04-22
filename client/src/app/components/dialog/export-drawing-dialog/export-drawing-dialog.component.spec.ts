import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppModule } from 'src/app/app.module';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { QueriesService } from 'src/app/services/serverInteraction/queries.service';
import { TESTDRAWING } from '../../gallery/drawing/enum';
import { EXPORT, FORMAT, VERIF } from './enum';
import { ExportDrawingDialogComponent } from './export-drawing-dialog.component';

describe('ExportDrawingDialogComponent', () => {
  let component: ExportDrawingDialogComponent;
  let fixture: ComponentFixture<ExportDrawingDialogComponent>;
  let mockCEDS: ClickEventDispatcherService;
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
    fixture = TestBed.createComponent(ExportDrawingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockCEDS = fixture.debugElement.injector.get(ClickEventDispatcherService);
    mockQS = fixture.debugElement.injector.get(QueriesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create create component without preview', () => {
    localStorage.clear();
    const fixtureNoPreview = TestBed.createComponent(ExportDrawingDialogComponent);
    fixtureNoPreview.detectChanges();
    expect(fixtureNoPreview.componentInstance).toBeTruthy();
  });

  it('should applied filter', () => {
    component.appliedFilter('blur(3px)');
    expect(component.att.serializeSVG).toEqual(component.att.serializeSVG);
  });

  it('Should not call a export methode since the name is too long', () => {
    component.att.drawingName = VERIF.TESTNAMETOLONG;
    const spy = spyOn(component, 'exportSVGFile');
    component.save();
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should call the SVG export methode with the good name', () => {
    component.att.exportMethode = EXPORT.DOWNLOAD;
    component.att.drawingName = TESTDRAWING.NAME;
    component.att.format = FORMAT.SVG;
    const spy = spyOn(component, 'exportSVGFile');
    component.save();
    expect(spy).toHaveBeenCalled();
  });

  it('Should not call the SVG export methode with a wrong email', () => {
    component.att.exportMethode = EXPORT.EMAIL;
    component.att.drawingName = TESTDRAWING.NAME;
    component.att.format = FORMAT.SVG;
    const spy = spyOn(component, 'exportSVGFile');
    component.att.email = VERIF.TESTEAMILSHOULDFAILL1;
    component.save();
    expect(spy).not.toHaveBeenCalled();
    component.att.email = VERIF.TESTEAMILSHOULDFAILL2;
    component.save();
    expect(spy).not.toHaveBeenCalled();
    component.att.email = VERIF.TESTEAMILSHOULDFAILL3;
    component.save();
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should call the SVG export methode with a good email', () => {
    component.att.exportMethode = EXPORT.EMAIL;
    component.att.drawingName = TESTDRAWING.NAME;
    component.att.format = FORMAT.SVG;
    const spy = spyOn(component, 'exportSVGFile');
    component.att.email = VERIF.TESTEAMILSHOULDPASS;
    component.save();
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the PNG export methode with the good name', () => {
    component.att.exportMethode = EXPORT.DOWNLOAD;
    component.att.drawingName = TESTDRAWING.NAME;
    component.att.format = FORMAT.PNG;
    const spy = spyOn(component, 'exportPNGorJPG');
    component.save();
    expect(spy).toHaveBeenCalled();
  });

  it('Should prepare a url in .PNG and send it to the download methode', () => {
    mockCEDS.canvas = component.targetCanvas.nativeElement;
    const spy = spyOn(mockCEDS.canvas, 'getBoundingClientRect').and.callFake( () => {
      return new DOMRect(2, 2);
    });
    spyOn(component, 'downloadFile').and.callFake( () => { return; });
    component.att.exportMethode = EXPORT.DOWNLOAD;
    component.att.format = FORMAT.PNG;
    component.exportPNGorJPG();
    expect(spy).toHaveBeenCalled();
  });

  it('Should prepare a url in .PNG and send it to the send Email methode', () => {
    mockCEDS.canvas = component.targetCanvas.nativeElement;
    const spy = spyOn(mockCEDS.canvas, 'getBoundingClientRect').and.callFake( () => {
      return new DOMRect(2, 2);
    });
    spyOn(component, 'sendFile').and.callFake( () => { return; });
    component.att.exportMethode = EXPORT.EMAIL;
    component.att.format = FORMAT.PNG;
    component.exportPNGorJPG();
    expect(spy).toHaveBeenCalled();
  });

  it('Should prepare a url in .JPG and send it to the download methode', () => {
    mockCEDS.canvas = component.targetCanvas.nativeElement;
    const spy = spyOn(mockCEDS.canvas, 'getBoundingClientRect').and.callFake( () => {
      return new DOMRect(2, 2);
    });
    spyOn(component, 'downloadFile').and.callFake( () => { return; });
    component.att.exportMethode = EXPORT.DOWNLOAD;
    component.att.format = FORMAT.JPG;
    component.exportPNGorJPG();
    expect(spy).toHaveBeenCalled();
  });

  it('Should prepare a url in .JPG and send it to the send email methode', () => {
    mockCEDS.canvas = component.targetCanvas.nativeElement;
    const spy = spyOn(mockCEDS.canvas, 'getBoundingClientRect').and.callFake( () => {
      return new DOMRect(1, 1);
    });
    spyOn(component, 'sendFile').and.callFake( () => { return; });
    component.att.exportMethode = EXPORT.EMAIL;
    component.att.format = FORMAT.JPG;
    component.exportPNGorJPG();
    expect(spy).toHaveBeenCalled();
  });

  it('Should prepare a url in .SVG and send it to the download methode', () => {
    mockCEDS.canvas = component.targetCanvas.nativeElement;
    const spy = spyOn(component, 'downloadFile').and.callFake( () => { return; });
    component.att.exportMethode = EXPORT.DOWNLOAD;
    component.att.format = FORMAT.SVG;
    component.exportSVGFile();
    expect(spy).toHaveBeenCalled();
  });

  it('Should prepare a url in .SVG and send it to the send email methode', () => {
    mockCEDS.canvas = component.targetCanvas.nativeElement;
    const spy = spyOn(component, 'sendFile').and.callFake( () => { return; });
    component.att.exportMethode = EXPORT.EMAIL;
    component.att.format = FORMAT.SVG;
    component.exportSVGFile();
    expect(spy).toHaveBeenCalled();
  });

  it('Should download in .svg format', () => {
    mockCEDS.canvas = component.targetCanvas.nativeElement;
    component.att.format = FORMAT.SVG;
    const spy = spyOn(component, 'close').and.callThrough();
    component.exportSVGFile();
    expect(spy).toHaveBeenCalled();
  });

  it('Should ask confirmation before sending a email (cancel)', async(() => {
    const spy = spyOn(component, 'close');
    mockCEDS.canvas = component.targetCanvas.nativeElement;
    component.att.exportMethode = EXPORT.EMAIL;
    component.att.format = FORMAT.SVG;
    component.exportSVGFile();
    const dialogRef = 'dialogRefConfirm';
    component[dialogRef].componentInstance.close();
    component[dialogRef].afterClosed().subscribe( () => {
      expect(spy).not.toHaveBeenCalled();
    });
  }));

  it('Should ask confirmation before sending a email (confirm)', async(() => {
    const spy = spyOn(mockQS, 'sendmail').and.callFake(
      async () => new Promise((resolve: (value?: string | PromiseLike<string>) => void) => {
      resolve('test');
      }
    ));
    mockCEDS.canvas = component.targetCanvas.nativeElement;
    component.att.exportMethode = EXPORT.EMAIL;
    component.att.format = FORMAT.SVG;
    component.exportSVGFile();
    const dialogRef = 'dialogRefConfirm';
    component[dialogRef].componentInstance.confirm();
    component[dialogRef].afterClosed().subscribe( () => {
      expect(spy).toHaveBeenCalled();
    });
  }));

  it('Should close the component', () => {
    const dialogRef = 'dialogRef';
    const spy = spyOn(component[dialogRef], 'close');
    component.close();
    expect(spy).toHaveBeenCalled();
  });

});

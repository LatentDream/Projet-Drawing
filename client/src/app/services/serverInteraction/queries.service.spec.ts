import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { AppModule } from 'src/app/app.module';
import { FORMAT, VERIF } from 'src/app/components/dialog/export-drawing-dialog/enum';
import { TESTDRAWING } from 'src/app/components/gallery/drawing/enum';
import { Drawing } from '../../../../../common/communication/drawing';
import { QueriesService } from './queries.service';

describe('QueriesService', () => {

  let httpTestingController: HttpTestingController;
  let service: QueriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueriesService, MatDialog],
      imports: [HttpClientTestingModule, OverlayModule, AppModule]
    });
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(QueriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#sendDrawingData()', () => {
    it('returned Observable should match the right data', () => {
      const mockDrawing = {
        currentName: 'validregexname',
        currentTags: ['validregex', 'validregex'],
        currentDrawing: 'somedrawing'
      };

      service.sendDrawingData(mockDrawing.currentName, mockDrawing.currentTags, mockDrawing.currentDrawing )
        .then( (value) => {
          expect(value).toEqual('drawing saved');
        });

      const req = httpTestingController.expectOne('http://localhost:3000/database/drawing');

      expect(req.request.method).toEqual('POST');

      req.flush('drawing saved');
    });
  });

  describe('#getAllDrawings', () => {
    it('returned Observable should match the right data', () => {

      service.getAllDrawings()
        .subscribe((drawings: Drawing[]) => {
          expect(drawings).toBeTruthy();
        });

      const req = httpTestingController.expectOne(
        'http://localhost:3000/database/drawings'
      );

      expect(req.request.method).toEqual('GET');

      req.flush('any');
    });
  });

  describe('#deleteDrawing', () => {
    it('returned Observable should match the right data', () => {

      service.deleteDrawing('5e580d366b252428d92b8838')
        .then( (value) => {
        expect(value).toEqual('drawing deleted');
      });

      const req = httpTestingController.expectOne(
        'http://localhost:3000/database/remove/5e580d366b252428d92b8838'
      );

      expect(req.request.method).toEqual('DELETE');

      req.flush('drawing deleted');
    });
  });

  describe('#sendmail', () => {
    it('returned Observable should match the right data', () => {

      service.sendmail(TESTDRAWING.NAME, FORMAT.SVG, VERIF.TESTEAMILSHOULDPASS , TESTDRAWING.DRAWING );

      const req = httpTestingController.expectOne(
        'http://localhost:3000/sendmail/fromServer'
      );

      req.flush({message: 'Couriel envoyé'});
    });
  });

  describe('#sendmail', () => {
    it('returned Observable should match the right data', () => {

      service.sendmail(TESTDRAWING.NAME, FORMAT.SVG, VERIF.TESTEAMILSHOULDPASS , TESTDRAWING.DRAWING );

      const req = httpTestingController.expectOne(
        'http://localhost:3000/sendmail/fromServer'
      );

      req.error(new ErrorEvent('Erreur'));
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});

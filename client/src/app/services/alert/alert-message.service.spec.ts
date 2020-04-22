import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppModule } from 'src/app/app.module';
import { AlertMessageService } from './alert-message.service';

describe('AlertMessageService', () => {

  const mockDialog = {
    close: () => { return; }
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ AppModule ],
    providers: [{ provide: APP_BASE_HREF, useValue: '/my/app' },
    { provide: MatDialogRef, useValue: mockDialog },
    { provide: MAT_DIALOG_DATA, useValue: {} }]
  }));

  it('should be created', () => {
    const service: AlertMessageService = TestBed.get(AlertMessageService);
    expect(service).toBeTruthy();
  });

  it('should create a alert component', () => {
    const service: AlertMessageService = TestBed.get(AlertMessageService);
    const spy = spyOn(service.dialog, 'open').and.callThrough();
    service.showPopUp('');
    expect(spy).toHaveBeenCalled();
  });

});

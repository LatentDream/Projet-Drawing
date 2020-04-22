import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppModule } from 'src/app/app.module';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  const dialogRef = 'dialogRef';

  const mockDialog = {
    close: () => { return; }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/my/app' },
      { provide: MatDialogRef, useValue: mockDialog },
      { provide: MAT_DIALOG_DATA, useValue: {} }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    const spy = spyOn(component[dialogRef], 'close');
    component.confirm();
    expect(spy).toHaveBeenCalled();
  });

  it('should close the dialog', () => {
    const spy = spyOn(component[dialogRef], 'close');
    component.close();
    expect(spy).toHaveBeenCalled();
  });
});

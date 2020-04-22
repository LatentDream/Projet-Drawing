
import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppModule } from 'src/app/app.module';
import { ColorToolVariables } from 'src/app/classes/color-tool-variables';
import { MockEvent } from 'src/app/classes/mock-events';
import { MockTarget } from 'src/app/classes/mock-target';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { TESTDRAWING } from '../../gallery/drawing/enum';
import { CreateDrawingDialogComponent } from './create-drawing-dialog.component';
import { CDZ, TESTCDZ } from './enum';

describe('CreateDrawingDialogComponent', () => {
  let component: CreateDrawingDialogComponent;
  let fixture: ComponentFixture<CreateDrawingDialogComponent>;
  const newWorkZone = 'newWorkZone';
  const colorService = 'colorService';
  const listening = 'listening';
  const dialogRef = 'dialogRef';
  const colorVariables = 'colorVariables';
  const commingFromMenu = 'commingFromMenu';

  const mockDialog = {
    close: () => { return; }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [{provide: APP_BASE_HREF, useValue: '/my/app'},
      { provide: MatDialogRef, useValue: mockDialog },
      { provide: MAT_DIALOG_DATA, useValue: {} }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDrawingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ------------------ OnInit method --------------- //
  it('should set the width, height and background color', () => {
    expect(component[newWorkZone].width).toBe(window.innerWidth - CDZ.INNERWIDTH);
    expect(component[newWorkZone].height).toBe(window.innerHeight - CDZ.INNERHEIGHT);
    expect(component[colorService].backgroundColor).toBe('rgba(255,255,255,1)');
    expect(component[newWorkZone].validation).toBe(false);
  });

  // ------------------- OnResize method ------------------- //
  it('should call onResize of component', () => {
    component[listening] = true;
    const spy = spyOn(component, 'onResize');
    window.dispatchEvent(new Event('resize'));
    expect(spy).toHaveBeenCalled();
  });

  it('should set newWorkZone width and height', () => {
    component[listening] = true;
    const event = new MockEvent('');
    const mockTarget = new MockTarget(TESTCDZ._280, TESTCDZ._20);
    spyOnProperty(event, 'currentTarget').and.returnValue(mockTarget);
    component.onResize(event);
    expect(component[newWorkZone].width).toBe(TESTCDZ._280 - CDZ.INNERWIDTH);
    expect(component[newWorkZone].height).toBe(TESTCDZ._20 - CDZ.INNERHEIGHT);
  });

  it('should NOT set newWorkZone width and height', () => {
    component[listening] = false;
    const event = new MockEvent('');
    const mockTarget = new MockTarget(TESTCDZ._280, TESTCDZ._20);
    spyOnProperty(event, 'currentTarget').and.returnValue(mockTarget);
    component.onResize(event);
    expect(component[newWorkZone].width).toBe(window.innerWidth - CDZ.INNERWIDTH);
    expect(component[newWorkZone].height).toBe(window.innerHeight - CDZ.INNERHEIGHT);
  });

  // ------------------ notListening method ----------------- //
  it('should set listening to false', () => {
    component[listening] = true;
    component.notListening();
    expect(component[listening]).toBe(false);
  });

  it('should send alert (not valid int)', () => {
    const alert = 'alert';
    const spy = spyOn(component[alert], 'showPopUp');
    component[newWorkZone].width = TESTCDZ._567and54;
    component[newWorkZone].height = TESTCDZ._567and54;
    component.save();
    expect(spy).toHaveBeenCalled();
  });

  it('should send alert (not valid drawing width heigt)', () => {
    const alert = 'alert';
    const spy = spyOn(component[alert], 'showPopUp');
    component[newWorkZone].width = 0;
    component[newWorkZone].height = 0;
    component.save();
    expect(spy).toHaveBeenCalled();
  });

  // --------------- Close Method -------------------- //
  it('should call notListening, dialogRef.close and router when commingFromMenu is true', () => {
    component[commingFromMenu] = true;
    const spy1 = spyOn(component, 'notListening');
    const spy2 = spyOn(component[dialogRef], 'close');
    component.close();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call notListening, dialogRef.close but not router when commingFromMenu is false', () => {
    component[commingFromMenu] = false;
    const spy1 = spyOn(component, 'notListening');
    const spy2 = spyOn(component[dialogRef], 'close');
    component.close();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  // -------------- Save Background Color ----------------- //
  it('should call colorService addColor and set variables', () => {
    const spy = spyOn(component[colorService], 'addColor');
    component[colorVariables] = new ColorToolVariables();
    component[colorVariables].color = 'newColor';
    component.saveBackgroundColor();
    expect(component[colorService].backgroundColor).toBe(component[colorVariables].color);
    expect(spy).toHaveBeenCalled();
  });

  it('should NOT call colorService addColor nor set variables', () => {
    const spy = spyOn(component[colorService], 'addColor');
    component[colorVariables] = new ColorToolVariables();
    component.saveBackgroundColor();
    expect(component[colorService].backgroundColor).not.toBe(component[colorVariables].color);
    expect(spy).not.toHaveBeenCalled();
  });

  // ------------------ Validate Color Entered ------------------ //
  it('should set colorVariables.color', () => {
    spyOn(global, 'parseInt').and.returnValue(1);
    component[colorVariables].color = 'test';
    component.validateColorEntered();
    expect(component[colorVariables].color).toBe('rgba(1,1,1,1)');
  });

  it('should send alert (not valid color (-1))', () => {
    spyOn(global, 'parseInt').and.returnValue(TESTCDZ._minus1);
    const alert = 'alert';
    const spy = spyOn(component[alert], 'showPopUp');
    component[colorVariables].color = 'test';
    component.validateColorEntered();
    expect(spy).toHaveBeenCalled();
  });

  it('should send alert (not valid color (257))', () => {
    spyOn(global, 'parseInt').and.returnValue(TESTCDZ._257);
    const alert = 'alert';
    const spy = spyOn(component[alert], 'showPopUp');
    component[colorVariables].color = 'test';
    component.validateColorEntered();
    expect(spy).toHaveBeenCalled();
  });

  it('should set right value', () => {
    component[newWorkZone].width = TESTCDZ._567and54;
    component[newWorkZone].height = TESTCDZ._22and3;
    component.isNormalInteger();
    expect(component.isNormalInteger()).toBe(false);
  });

  // ------------------ Create and overWrite drawing ------------------ //
  it('Should create a new canvas', () => {
    localStorage.removeItem(AUTOSAVE.LOCATION);
    const dialogRefAtt = 'dialogRef';
    const spy = spyOn(component[dialogRefAtt], 'close');
    component[newWorkZone].width = TESTCDZ._280;
    component[newWorkZone].height = TESTCDZ._280;
    component.save();
    expect(spy).toHaveBeenCalled();
  });

  it('Should create a new canvas', async () => {
    localStorage.setItem(AUTOSAVE.LOCATION, TESTDRAWING.DRAWING);
    const spy = spyOn(component, 'close');
    component[newWorkZone].width = TESTCDZ._280;
    component[newWorkZone].height = TESTCDZ._280;
    component.save();
    const dialogRefConfirm = 'dialogRefConfirm';
    component[dialogRefConfirm].componentInstance.confirm();
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should create a new canvas', async () => {
    localStorage.setItem(AUTOSAVE.LOCATION, TESTDRAWING.DRAWING);
    const dialogRefAtt = 'dialogRef';
    const spy = spyOn(component[dialogRefAtt], 'close');
    component[newWorkZone].width = TESTCDZ._280;
    component[newWorkZone].height = TESTCDZ._280;
    component.save();
    const dialogRefConfirm = 'dialogRefConfirm';
    component[dialogRefConfirm].componentInstance.close();
    expect(spy).not.toHaveBeenCalled();
  });

});

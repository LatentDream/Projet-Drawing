import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { AUTOSAVE } from 'src/app/services/auto-save/auto-save.enum';
import { TESTDRAWING } from '../gallery/drawing/enum';
import { MainMenuComponent } from './main-menu.component';

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/my/app' }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create without preview', () => {
    expect(component).toBeTruthy();
  });

  it('should create with preview', () => {
    localStorage.setItem(AUTOSAVE.LOCATION, TESTDRAWING.DRAWING);
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with a preview of the old drawing', () => {
    const imgBefore = component.img;
    localStorage.setItem(AUTOSAVE.LOCATION, TESTDRAWING.DRAWING);
    component.svgToCanvas();
    expect(imgBefore).not.toEqual(component.img);
  });

  it('should delete the old drawing', async( () => {
    localStorage.setItem(AUTOSAVE.LOCATION, TESTDRAWING.DRAWING);
    const spy = spyOn(localStorage, 'removeItem');
    component.newDrawing();
    const dialogRef = 'dialogRefDelete';
    const deleteConfirm = component[dialogRef].componentInstance;
    deleteConfirm.confirm();
    fixture.detectChanges();
    component[dialogRef].afterClosed().subscribe( () => {
      expect(spy).toHaveBeenCalled();
    });
  }));

  it('should not delete the old drawing', async( () => {
    localStorage.setItem(AUTOSAVE.LOCATION, TESTDRAWING.DRAWING);
    const spy = spyOn(localStorage, 'removeItem');
    component.newDrawing();
    const dialogRef = 'dialogRefDelete';
    const deleteConfirm = component[dialogRef].componentInstance;
    deleteConfirm.close();
    fixture.detectChanges();
    component[dialogRef].afterClosed().subscribe( () => {
      expect(spy).not.toHaveBeenCalled();
    });
  }));

  it('should not delete the old drawing', () => {
    localStorage.clear();
    const routerService = 'router';
    const spy = spyOn(component[routerService], 'navigateByUrl');
    component.newDrawing();
    expect(spy).toHaveBeenCalled();
  });

  it('should call new drawing when hotkey ctrl + o', () => {
    const spy = spyOn(component, 'newDrawing');
    const event = new KeyboardEvent('keydown', {key: 'o'});
    spyOnProperty(event, 'ctrlKey').and.returnValue(true);
    component.hotKeysDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should not call new drawing when hotkey is not ctrl + o', () => {
    const spy = spyOn(component, 'newDrawing');
    const event = new KeyboardEvent('keydown', {key: 'c'});
    spyOnProperty(event, 'ctrlKey').and.returnValue(true);
    component.hotKeysDown(event);
    expect(spy).not.toHaveBeenCalled();
  });
});

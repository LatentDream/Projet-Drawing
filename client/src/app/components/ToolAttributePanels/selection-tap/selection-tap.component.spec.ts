import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { SelectionTAPComponent } from './selection-tap.component';

describe('SelectionTAPComponent', () => {
  let component: SelectionTAPComponent;
  let fixture: ComponentFixture<SelectionTAPComponent>;
  let clipboard: ClipboardService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionTAPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionTAPComponent);
    component = fixture.componentInstance;
    clipboard = TestBed.get(ClipboardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call copy', () => {
    const spy = spyOn(clipboard, 'copy');
    component.copy();
    expect(spy).toHaveBeenCalled();
  });

  it('should call paste', () => {
    const spy = spyOn(clipboard, 'paste');
    component.paste();
    expect(spy).toHaveBeenCalled();
  });

  it('should call copy', () => {
    const spy = spyOn(clipboard, 'duplicate');
    component.duplicate();
    expect(spy).toHaveBeenCalled();
  });

  it('should call copy', () => {
    const spy = spyOn(clipboard, 'cut');
    component.cut();
    expect(spy).toHaveBeenCalled();
  });

  it('should call copy', () => {
    const spy = spyOn(clipboard, 'delete');
    component.delete();
    expect(spy).toHaveBeenCalled();
  });

});

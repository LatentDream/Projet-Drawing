import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { GridService } from 'src/app/services/grid/grid.service';
import { GridTAPComponent } from './grid-tap.component';

describe('GridTAPComponent', () => {
  let component: GridTAPComponent;
  let fixture: ComponentFixture<GridTAPComponent>;
  let service: GridService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [ {provide: APP_BASE_HREF, useValue: '/my/app'} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTAPComponent);
    component = fixture.componentInstance;
    service = TestBed.get(GridService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gridServices scaleChange', () => {
    const slider = fixture.debugElement.query(By.css('#slider1'));
    const spy = spyOn(service, 'scaleChange');
    slider.triggerEventHandler('change', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call gridServices scaleChange', () => {
    const slider = fixture.debugElement.query(By.css('#slider2'));
    const spy = spyOn(service, 'opacityChange');
    slider.triggerEventHandler('change', null);
    expect(spy).toHaveBeenCalled();
  });
});

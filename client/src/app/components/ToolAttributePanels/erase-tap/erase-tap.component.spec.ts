import {APP_BASE_HREF} from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatSliderChange} from '@angular/material/slider';
import { AppModule } from 'src/app/app.module';
import {EraseService} from '../../../services/erase/erase.service';
import { EraseTapComponent } from './erase-tap.component';

describe('EraseTapComponent', () => {
  let component: EraseTapComponent;
  let fixture: ComponentFixture<EraseTapComponent>;
  let mockEraseService: EraseService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraseTapComponent);
    component = fixture.componentInstance;
    mockEraseService = fixture.debugElement.injector.get(EraseService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update attribute transparencyChanged if transparency slider is used', () => {
    const sliderEvent = new MatSliderChange();
    sliderEvent.value = 1;
    component.updateSliderValueConnectors(sliderEvent);
    expect(mockEraseService.eraserSize).toEqual(1);

  });

  it('should update attribute transparencyChanged if transparency slider is used', () => {
    const sliderEvent = new MatSliderChange();
    sliderEvent.value = null;
    component.updateSliderValueConnectors(sliderEvent);
    const three = 3;
    expect(mockEraseService.eraserSize).toEqual(three);

  });

});

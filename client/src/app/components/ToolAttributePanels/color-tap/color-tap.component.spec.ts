import {APP_BASE_HREF} from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { MockMatSliderChange } from 'src/app/classes/mock-mat-slider-change2';
import { BucketService } from 'src/app/services/bucket/bucket.service';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { ColorTAPComponent } from './color-tap.component';

describe('ColorTAPComponent', () => {
  let component: ColorTAPComponent;
  let fixture: ComponentFixture<ColorTAPComponent>;
  let mockCEDS: ClickEventDispatcherService;
  let mockBucketService: BucketService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorTAPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockCEDS = fixture.debugElement.injector.get(ClickEventDispatcherService);
    mockBucketService = fixture.debugElement.injector.get(BucketService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('Should change the tool selected', () => {
    const toolSelectionButton = fixture.debugElement.query(By.css('.attButtonGroupContainerTop'));
    const spy = spyOn(mockCEDS, 'setCurrentTool').and.callThrough();
    toolSelectionButton.triggerEventHandler('change', {value: 'color'});
    expect(spy).toHaveBeenCalled();
  });

  it('Should change tolerance', () => {
    const event = new MockMatSliderChange();
    event.value = 2;
    component.changeTolerance(event);

    expect(mockBucketService.tolerance).toEqual(event.value);
  });

  it('Should change tolerance', () => {
    const event = new MockMatSliderChange();
    event.value = null;
    component.changeTolerance(event);

    expect(mockBucketService.tolerance).toEqual(1);
  });
});

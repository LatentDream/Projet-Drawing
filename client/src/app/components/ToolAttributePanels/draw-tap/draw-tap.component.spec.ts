import {APP_BASE_HREF} from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { BrushService } from 'src/app/services/drawer/brush/brush.service';
import { TextureService } from 'src/app/services/texture/texture.service';
import { TEXTURE } from '../../enum';
// import { TOOLS } from '../../enum';
import { DrawTAPComponent } from './draw-tap.component';

describe('DrawTAPComponent', () => {
  let component: DrawTAPComponent;
  let fixture: ComponentFixture<DrawTAPComponent>;
  let mockCEDS: ClickEventDispatcherService;
  let mockBrushService: BrushService;
  let mockTextureService: TextureService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawTAPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockCEDS = fixture.debugElement.injector.get(ClickEventDispatcherService);
    mockBrushService = fixture.debugElement.injector.get(BrushService);
    mockTextureService = fixture.debugElement.injector.get(TextureService);

  });

  it('Should create the coponent', () => {
    expect(component).toBeTruthy();
  });

  it('Texture map should already by initialise', () => {
    const texture = 'textureBinding';
    expect(component[texture].has(TEXTURE.BASE)).toEqual(true);
  });

  it('Should update the current texture', () => {
    const currentTool = 'currentTool';
    mockCEDS[currentTool] = 'brush';
    fixture.detectChanges();
    const textureSelectionButton = fixture.debugElement.query(By.css('.textureButton'));
    textureSelectionButton.triggerEventHandler('change', {value: 'base'});
    expect(mockBrushService.currentFilter).toEqual(mockTextureService.filterBase);
  });

  it('Should not update the current texture', () => {
    const currentTool = 'currentTool';
    mockCEDS[currentTool] = 'brush';
    fixture.detectChanges();
    const textureSelectionButton = fixture.debugElement.query(By.css('.textureButton'));
    mockBrushService.currentFilter = mockTextureService.filterBase;
    textureSelectionButton.triggerEventHandler('change', {value: ''});
    expect(mockBrushService.currentFilter).toEqual(mockTextureService.filterBase);
  });

  it('Should change the tool selected', () => {
    const toolSelectionButton = fixture.debugElement.query(By.css('.attButtonGroupContainerTop'));
    const spy = spyOn(mockCEDS, 'setCurrentTool').and.callThrough();
    toolSelectionButton.triggerEventHandler('change', {value: 'draw'});
    expect(spy).toHaveBeenCalled();
  });

});

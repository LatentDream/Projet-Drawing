import { AfterViewInit, Component } from '@angular/core';
import { MatButtonToggleChange, MatRadioChange } from '@angular/material';
import { ClickEventDispatcherService } from 'src/app/services/dispatcher/click-event-dispatcher.service';
import { BrushService } from 'src/app/services/drawer/brush/brush.service';
import { FeatherService } from 'src/app/services/drawer/feather/feather.service';
import { PencilService } from 'src/app/services/drawer/pencil/pencil.service';
import { SprayService } from 'src/app/services/spray/spray.service';
import { TextureService } from 'src/app/services/texture/texture.service';
import { DRAW, TEXTURE } from '../../enum';

@Component({
  selector: 'app-draw-tap',
  templateUrl: './draw-tap.component.html',
  styleUrls: ['./draw-tap.component.scss']
})
export class DrawTAPComponent implements AfterViewInit {

  private textureBinding: Map<TEXTURE, HTMLElement>;
  buttonValue: string;

  constructor(private clickEventDispatcher: ClickEventDispatcherService,
              private brushService: BrushService,
              private textureService: TextureService,
              private pencilService: PencilService,
              private sprayService: SprayService,
              private featherService: FeatherService
              ) {
    this.textureBinding = new Map();
    this.pencilService.strokeWidth = DRAW.BASESTROKE;
    this.brushService.strokeWidth = DRAW.BASESTROKE;
    this.sprayService.strokeWidth = DRAW.BASESTROKESPRAY;
    this.featherService.strokeWidth = DRAW.BASESTROKE;
    this.buttonValue = DRAW.PENCIL;
  }

  ngAfterViewInit(): void {
    this.brushService.currentFilter = this.textureService.filterBase;
    this.bindTextures();
  }

  private bindTextures(): void {
    this.textureBinding.set(TEXTURE.TURBULENCE, this.textureService.filterTurbulence)
                    .set(TEXTURE.BLURRY, this.textureService.filterBlurry)
                    .set(TEXTURE.NOISE, this.textureService.filterNoise)
                    .set(TEXTURE.BASE, this.textureService.filterBase)
                    .set(TEXTURE.SQUIGLY, this.textureService.filterSquigly);
  }

  updateCurrentTexture(event: MatRadioChange): void {
    if (this.textureBinding.has(event.value)) {
      // tslint:disable-next-line: no-non-null-assertion
      this.brushService.currentFilter = this.textureBinding.get(event.value)!;
      // Defined in constructor and map is private
    }
  }

  toolChange(event: MatButtonToggleChange): void {
    this.clickEventDispatcher.setCurrentTool(event.value);
    this.buttonValue = event.value;
  }

}

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TextureService } from 'src/app/services/texture/texture.service';
import { TEXTURE } from '../enum';

@Component({
  selector: 'app-texture',
  templateUrl: './texture.component.html',
  styleUrls: ['./texture.component.scss']
})
export class TextureComponent implements AfterViewInit {

  constructor(private textureService: TextureService) { }

  @ViewChild(TEXTURE.TURBULENCE, {static: false}) turbulence: ElementRef;
  @ViewChild(TEXTURE.BLURRY, {static: false}) blurry: ElementRef;
  @ViewChild(TEXTURE.BASE, {static: false}) base: ElementRef;
  @ViewChild(TEXTURE.NOISE, {static: false}) noise: ElementRef;
  @ViewChild(TEXTURE.SQUIGLY, {static: false}) squigly: ElementRef;

  ngAfterViewInit(): void {
    this.textureService.filterTurbulence = this.turbulence.nativeElement;
    this.textureService.filterBlurry = this.blurry.nativeElement;
    this.textureService.filterBase = this.base.nativeElement;
    this.textureService.filterNoise = this.noise.nativeElement;
    this.textureService.filterSquigly = this.squigly.nativeElement;
  }

}

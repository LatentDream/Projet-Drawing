import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent implements AfterViewInit {

  // pour acceder au viewchild
  @ViewChild('canvas', {static: false})
  canvas: ElementRef<HTMLCanvasElement>;

  @Output()
  color: EventEmitter<string> = new EventEmitter();

  private ctx: CanvasRenderingContext2D;
  private mouseDown: boolean;
  private selectedWidth: number;

  constructor() {
    this.mouseDown = false;
  }

  ngAfterViewInit(): void {
    this.draw();
  }

  draw(): void {
    if (!this.canvas) {
      return;
    }

    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.ctx.clearRect(0, 0, width, height);

    const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
    const value1 = 0;
    const value2 = 0.17;
    const value3 = 0.34;
    const value4 = 0.51;
    const value5 = 0.68;
    const value6 = 0.86;
    const value7 = 1;
    gradient.addColorStop(value1, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(value2, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(value3, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(value4, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(value5, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(value6, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(value7, 'rgba(255, 0, 0, 1)');

    this.ctx.beginPath();
    this.ctx.rect(0, 0, width, height);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();

    const ten = 10;
    const five = 5;

    if (this.selectedWidth) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 2;
      this.ctx.rect(this.selectedWidth - five, 0, ten, height);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent): void {
    this.mouseDown = false;
  }

  onMouseDown(evt: MouseEvent): void {
    this.mouseDown = true;
    this.selectedWidth = evt.offsetX;
    this.draw();
    this.emitColor(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mouseDown) {
      this.selectedWidth = evt.offsetX;
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  emitColor(x: number, y: number): void {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
  }

  getColorAtPosition(x: number, y: number): string {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data;
    return (
      'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)'
    );
  }
}

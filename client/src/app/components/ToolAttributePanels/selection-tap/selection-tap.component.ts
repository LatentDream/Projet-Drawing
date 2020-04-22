import { Component } from '@angular/core';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';

@Component({
  selector: 'app-selection-tap',
  templateUrl: './selection-tap.component.html',
  styleUrls: ['./selection-tap.component.scss']
})
export class SelectionTAPComponent {

  constructor(private clipboard: ClipboardService) {
   }

  copy(): void {
    this.clipboard.copy();
  }

  paste(): void {
    this.clipboard.paste();
  }

  duplicate(): void {
    this.clipboard.duplicate();
  }

  cut(): void {
    this.clipboard.cut();
  }

  delete(): void {
    this.clipboard.delete();
  }
}

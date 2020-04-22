import { Injectable } from '@angular/core';
import {Queue} from './queue';

@Injectable({
  providedIn: 'root'
})

export class ColorService {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  queue: Queue;

  constructor() {
    this.primaryColor = 'rgba(0, 0, 0)';
    this.secondaryColor = 'rgba(0, 0, 0)';
    this.backgroundColor = 'rgba(255,255,255,1)';
    this.queue = new Queue();
  }

  addColor(color: string, transparencyChanged: boolean): void {
    let colorDuplicate = false;
    let queueColor: string;
    // evite d'ajouter des couleurs en double
    // ni des couleurs ou la transparence est modifier

    for (const str of this.queue.data) {
      queueColor = str;
      if (queueColor) {
        if (color === queueColor) {
          colorDuplicate = true;
        }
      }
    }
    const ten = 10;
    if (this.queue.data.length < ten && !colorDuplicate && !transparencyChanged) {
      this.queue.add(color);
    } else if ( !colorDuplicate && !transparencyChanged) {
      this.queue.remove();
      this.queue.add(color);
    }
  }

}

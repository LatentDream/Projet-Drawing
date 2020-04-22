import { Injectable, Renderer2,  RendererFactory2 } from '@angular/core';
import { TextParams } from 'src/app/classes/text-params';
import { ColorService } from '../color/color.service';
import {  RECT, TEXT } from '../enum';
// import { LEFT_ARROW } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  textParams: TextParams;
  private parent: HTMLElement;
  private renderer: Renderer2;
  private text: SVGElement;
  private rect: SVGElement;
  isText: boolean;
  isFirstWord: boolean;
  isFirstLetter: boolean;
  currentPosition: number;
  currentLine: number;

  constructor(renderFactory: RendererFactory2, private colorService: ColorService) {
    this.renderer = renderFactory.createRenderer(null, null);
    this.textParams = new TextParams();
    this.isText = false;
    this.isFirstWord = true;
    this.isFirstLetter =  true;
    this.currentPosition = 0;
    this.currentLine = 0;
  }

  setParent(event: MouseEvent): void {
    if (String((event.target as HTMLElement).nodeName) !== 'svg') {
      this.parent = (event.target as HTMLElement).parentNode as HTMLElement;
    } else {
      this.parent = event.target as HTMLElement;
    }
  }

  mouseClick(event: MouseEvent): void {
    if (!this.textParams.rendering) {
      // Start rendering
      this.textParams.rendering = true;
      this.textParams.left = false;
      this.isText = true;
      // this.alignment();

      // Gets the parent HTMLElement (svg)
      this.setParent(event);

      // Set the text box
      this.setTextBox(event);
    } else {
      this.finishEdit();
    }
  }

  write(event: KeyboardEvent): void {
    if (this.isFirstWord) {
      this.textParams.currentMember.innerHTML = '';
      this.currentPosition += 1;
      this.textParams.currentMember.innerHTML += event.key +  '|';
      this.isFirstWord = false;
      this.removeRect();
      this.isFirstLetter = false;
    }  else {
      const phraseString = this.textParams.sentence[this.currentLine].innerHTML;
      let firstString = '';
      let secondString = '';
      if (this.currentPosition > this.textParams.sentence[this.currentLine].innerHTML.length) {
        firstString = phraseString.substring(0, this.textParams.sentence[this.currentLine].innerHTML.length - 1);
      } else {
        firstString = phraseString.substring(0, this.currentPosition);
        secondString = phraseString.substring(this.currentPosition + 1, phraseString.length);
      }
      this.currentPosition += 1;
      firstString += event.key + '|';
      this.textParams.sentence[this.currentLine].innerHTML = firstString + secondString;
    }
  }

  setTextBox(event: MouseEvent): void {
    // Start point of text box
    this.textParams.startX = event.offsetX;
    this.textParams.startY = event.offsetY;

    this.createRect();

    this.text = this.renderer.createElement(TEXT.ELEMENT, TEXT.LINK);
    this.renderer.setAttribute(this.text, 'innerHTML', ' ');
    this.renderer.setAttribute(this.text, TEXT.X, this.textParams.startX.toString());
    this.renderer.setAttribute(this.text, TEXT.Y, this.textParams.startY.toString());
    this.renderer.setAttribute(this.text, TEXT.FILL, this.colorService.primaryColor);
    this.renderer.setAttribute(this.text, TEXT.FONT_SIZE, this.textParams.fontWeight.toString());

    this.renderer.appendChild(this.parent, this.text);

    this.textParams.currentMember = this.renderer.createElement(TEXT.ELEMENT_NEXT, TEXT.LINK);
    this.renderer.setAttribute(this.textParams.currentMember, TEXT.DY, '1');
    this.renderer.setAttribute(this.textParams.currentMember, TEXT.X, this.textParams.startX.toString());
    this.textParams.sentence.push(this.textParams.currentMember);
    this.renderer.appendChild(this.text, this.textParams.currentMember);
    this.textParams.newY = this.textParams.startY;
    const six = 6;
    this.textParams.posCursorY = this.textParams.newY - this.textParams.fontWeight + six;
    this.textParams.posCursorX = this.textParams.startX + (this.textParams.fontWeight / six);
    this.textParams.sentence[0].innerHTML = 'Écrire ici!';

  }

  createRect(): void {
    this.rect = this.renderer.createElement(RECT.ELEMENT, RECT.LINK);
    this.renderer.setAttribute(this.rect, RECT.FILL_OPACITY, '0');
    this.renderer.setAttribute(this.rect, RECT.STROKE, 'black');
    const pos = (this.textParams.startY - this.textParams.fontWeight);
    const eleven = 11;
    const boxSizeX = this.textParams.fontWeight * eleven;
    const boxSizeY = this.textParams.fontWeight * 2;
    this.renderer.setAttribute(this.rect, RECT.X, this.textParams.startX.toString());
    this.renderer.setAttribute(this.rect, RECT.Y, pos.toString());
    this.renderer.setAttribute(this.rect, RECT.WIDTH, boxSizeX.toString());
    this.renderer.setAttribute(this.rect, RECT.HEIGHT, boxSizeY.toString());
    this.renderer.appendChild(this.parent, this.rect);
  }

  removeRect(): void {
    this.renderer.removeChild(this.parent, this.rect);
  }

  finishEdit(): void {
    if (this.isFirstLetter) {
      this.removeRect();
      this.textParams.currentMember.innerHTML = '';
    } else {
      const removeCurrentPlaceholder = this.textParams.sentence[this.currentLine].innerHTML;
      const first = removeCurrentPlaceholder.substring(0, this.currentPosition);
      const second = removeCurrentPlaceholder.substring(this.currentPosition + 1, removeCurrentPlaceholder.length);
      this.textParams.sentence[this.currentLine].innerHTML = first + second;
    }
    this.textParams.rendering = false;
    this.isText = false;
    this.isFirstWord = true;
    this.isFirstLetter = true;
    this.textParams.newY = 0;
    this.currentPosition = 0;
    this.textParams.sentence = [];
    this.currentLine = 0;

  }

  deletePreviousCaracter(): void {
    if (this.textParams.currentMember.innerHTML === 'Écrire ici!' ) {
      this.textParams.currentMember.innerHTML = '|';
    } else if (this.textParams.sentence[this.currentLine].innerHTML === '|') {
      const currentSentence = this.textParams.sentence[this.currentLine].innerHTML;
      this.textParams.sentence[this.currentLine].innerHTML = currentSentence.substring(0, this.currentPosition - 1);
      this.currentPosition -= 1;
      if (this.textParams.sentence.length > 1) {
        this.renderer.removeChild(this.text, this.textParams.sentence[this.currentLine]);
        this.textParams.sentence.pop();
        this.currentLine -= 1;
        this.textParams.sentence[this.currentLine] = this.textParams.sentence[this.textParams.sentence.length - 1];
        this.textParams.newY -= this.textParams.fontWeight;
        this.currentPosition = this.textParams.sentence[this.currentLine].innerHTML.length;
        this.textParams.sentence[this.currentLine].innerHTML += '|';
      } else {
        this.currentPosition = 0;
        this.textParams.sentence[this.currentLine].innerHTML = '|';
      }
    } else {
      const removeCurrentPlaceholder = this.textParams.sentence[this.currentLine].innerHTML;
      const removedLeft = removeCurrentPlaceholder.substring(0, this.currentPosition - 1);
      const keepRight = removeCurrentPlaceholder.substring(this.currentPosition + 1, removeCurrentPlaceholder.length);
      this.textParams.sentence[this.currentLine].innerHTML = removedLeft + '|' + keepRight;
      console.log(this.textParams.sentence[this.currentLine].innerHTML);
      this.currentPosition -= 1;
    }
  }

  deleteNextCaracter(): void {
    const removeCurrentPlaceholder = this.textParams.currentMember.innerHTML;
    const leftSide = removeCurrentPlaceholder.substring(0, this.currentPosition);
    const rightSide = removeCurrentPlaceholder.substring(this.currentPosition + 2, this.textParams.currentMember.innerHTML.length);
    this.textParams.currentMember.innerHTML = leftSide + '|' + rightSide;
  }

  cancelEdition(): void {
    this.textParams.currentMember.innerHTML = '';
    this.finishEdit();
  }

  changeLine(): void {
    this.currentPosition = 0;
    this.currentLine += 1;
    const removeCurrentPlaceholder = this.textParams.currentMember.innerHTML;
    this.textParams.currentMember.innerHTML = removeCurrentPlaceholder.substring(0, removeCurrentPlaceholder.length - 1);
    this.textParams.newY += this.textParams.fontWeight;
    this.textParams.currentMember = this.renderer.createElement(TEXT.ELEMENT_NEXT, TEXT.LINK);
    this.renderer.setAttribute(this.textParams.currentMember, TEXT.Y, this.textParams.newY.toString() );
    this.renderer.setAttribute(this.textParams.currentMember, TEXT.X, this.textParams.startX.toString());
    this.textParams.sentence.push(this.textParams.currentMember);
    this.renderer.appendChild(this.text, this.textParams.currentMember);
    this.textParams.sentence[this.currentLine].innerHTML = '|';
  }

  moveLeftText(): void {
    if (this.currentPosition !== 0) {
    const removeCurrentPlaceholder = this.textParams.sentence[this.currentLine].innerHTML;
    const removedLeft = removeCurrentPlaceholder.substring(0, this.currentPosition - 1);
    const midChar = removeCurrentPlaceholder.substring(this.currentPosition - 1, this.currentPosition);
    const keepRight = removeCurrentPlaceholder.substring(this.currentPosition + 1,
    this.textParams.sentence[this.currentLine].innerHTML.length);
    this.textParams.currentMember.innerHTML = removedLeft + '|' + midChar + keepRight;
    this.currentPosition -= 1;
    }
  }

  moveRightText(): void {
    if (this.currentPosition !== this.textParams.sentence[this.currentLine].innerHTML.length - 1) {
      const removeCurrentPlaceholder = this.textParams.sentence[this.currentLine].innerHTML;
      const removedLeft = removeCurrentPlaceholder.substring(0, this.currentPosition);
      const midChar = removeCurrentPlaceholder.substring(this.currentPosition + 1, this.currentPosition + 2);
      const keepRight = removeCurrentPlaceholder.substring(this.currentPosition + 2,
      this.textParams.sentence[this.currentLine].innerHTML.length);
      this.textParams.sentence[this.currentLine].innerHTML = removedLeft + midChar + '|' + keepRight;
      this.currentPosition += 1;
    }
  }
  moveDownText(): void {
    if ( this.currentLine !== this.textParams.sentence.length - 1) {
      const removeCurrentPlaceholder = this.textParams.sentence[this.currentLine].innerHTML;
      const removedLeft = removeCurrentPlaceholder.substring(0, this.currentPosition);
      const keepRight = removeCurrentPlaceholder.substring(this.currentPosition + 1, removeCurrentPlaceholder.length);
      this.textParams.sentence[this.currentLine].innerHTML = removedLeft + keepRight;
      const up = this.textParams.sentence[this.currentLine + 1].innerHTML;
      const first = up.substring(0, this.currentPosition);
      const last = up.substring(this.currentPosition, up.length);
      this.textParams.sentence[this.currentLine + 1].innerHTML = first + '|' + last;
      this.currentLine += 1;
    }

  }

  moveUpText(): void {
    if ( this.currentLine !== 0) {
      const removeCurrentPlaceholder = this.textParams.sentence[this.currentLine].innerHTML;
      const removedLeft = removeCurrentPlaceholder.substring(0, this.currentPosition);
      const keepRight = removeCurrentPlaceholder.substring(this.currentPosition + 1, removeCurrentPlaceholder.length);
      this.textParams.sentence[this.currentLine].innerHTML = removedLeft + keepRight;
      const up = this.textParams.sentence[this.currentLine - 1].innerHTML;
      const first = up.substring(0, this.currentPosition);
      const last = up.substring(this.currentPosition, up.length);
      this.textParams.sentence[this.currentLine - 1].innerHTML = first + '|' + last;
      this.currentLine -= 1;
    }
  }

  updateWeight(): void {
    this.renderer.setAttribute(this.text, TEXT.FONT_WEIGHT, this.textParams.fontStyle);
  }
  updateStyle(): void {
    this.renderer.setAttribute(this.text, TEXT.FONT_STYLE, this.textParams.fontStyle);
  }
  updateFF(): void {
    this.renderer.setAttribute(this.text, TEXT.FONT_FAMILY, this.textParams.fontFamily);
  }
  updateAlign(): void {
    this.renderer.setAttribute(this.text, TEXT.ALIGN, this.textParams.align);
  }

}

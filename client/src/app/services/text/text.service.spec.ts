import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RECT, TEXT } from 'src/app/services/enum';
import { TextService } from './text.service';

describe('TextService', () => {
  let service: TextService;
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2]
    });
    service = TestBed.get(TextService);
    renderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a renderer', () => {
    const rendererStr = 'renderer';
    expect(service[rendererStr]).toBeDefined();
  });

  it('should set parent to parentNode of target', () => {
    const rendererStr = 'renderer';
    const parent = 'parent';
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockParent: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    service[rendererStr] = renderer;
    Object.defineProperty(event, 'target', { get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });

    service.setParent(event);
    expect(service[parent]).toBe(mockParent);
  });

  it('should set parent to target', () => {
    const rendererStr = 'renderer';
    const parent = 'parent';
    const event: MouseEvent = new MouseEvent('mousedown');
    const mockTarget: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    Object.defineProperty(mockTarget, 'nodeName', { value: 'svg' });
    service[rendererStr] = renderer;
    Object.defineProperty(event, 'target', { value: mockTarget });

    service.setParent(event);
    expect(service[parent]).toBe(mockTarget);
  });

  it('should call finishEdit', () => {
    const event = new MouseEvent('click');
    spyOnProperty(event, 'target').and.returnValue(parent);
    spyOn(service, 'finishEdit');
    service.textParams.rendering = true;
    service.mouseClick(event);
    expect(service.finishEdit).toHaveBeenCalled();
  });

  it('should set all value to start a text', () => {

    const event = new MouseEvent('click');
    service.textParams.rendering = false;
    const parent = document.createElement('svg');
    spyOnProperty(event, 'target').and.returnValue(parent);
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const spy = spyOn(service, 'setTextBox');
    spyOn(service, 'finishEdit');
    service.mouseClick(event);
    expect(service.textParams.rendering).toEqual(true);
    expect(service.textParams.left).toEqual(false);
    expect(service.isText).toEqual(true);
    expect(spy).toHaveBeenCalledWith(event);
    expect(service.setTextBox).toHaveBeenCalledWith(event);
  });

  it('should write first letter and initialize value', () => {
    const event = new KeyboardEvent('keydown', { key: 'a' });
    service.isFirstWord = true;
    const current = jasmine.createSpyObj('any', ['innerHTML']);
    const spyRect = spyOn(service, 'removeRect');
    service.textParams.currentMember = current;
    service.write(event);
    expect(service.textParams.currentMember.innerHTML).toEqual('a|');
    expect(service.isFirstWord).toEqual(false);
    expect(service.isFirstLetter).toEqual(false);
    expect(spyRect).toHaveBeenCalled();
  });

  it('should not change second string', () => {
    const event = new KeyboardEvent('keydown', { key: 'a' });
    service.isFirstWord = false;
    service.currentPosition = 1;
    const current = jasmine.createSpyObj('any', ['innerHTML']);
    service.textParams.currentMember = current;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentence, 'innerHTML', { value: 'hey'});
    service.textParams.sentence[0] = currentSentence;
    service.write(event);
    expect(service.textParams.sentence[0].innerHTML).toEqual('ha|y');

  });

  it('should change second string', () => {
    const event = new KeyboardEvent('keydown', { key: 'a' });
    service.isFirstWord = false;
    const pos = 4;
    service.currentPosition = pos;
    const current = jasmine.createSpyObj('any', ['innerHTML']);
    service.textParams.currentMember = current;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentence, 'innerHTML', { value: 'hey'});
    service.textParams.sentence[0] = currentSentence;
    service.write(event);
    expect(service.textParams.sentence[0].innerHTML).toEqual('hea|');
  });

  it('should create a rect', () => {

    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const mockOffsetX = 10;
    service.textParams.startX = mockOffsetX;
    service.createRect();
    expect(renderer.appendChild).toHaveBeenCalled();
    const nbTimes = 6;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
    const rect = 'rect';
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[rect], RECT.WIDTH, '165');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[rect], RECT.HEIGHT, '30');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[rect], RECT.FILL_OPACITY, '0');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[rect], RECT.STROKE, 'black');

  });

  it('should remove child from parent', () => {
    const rendererStr = 'renderer';
    const spy = spyOn(service[rendererStr], 'removeChild');
    service.removeRect();
    expect(spy).toHaveBeenCalled();
  });

  it('should call removeRect', () => {
    service.isFirstLetter = true;
    const spyRect = spyOn(service, 'removeRect');
    const current = jasmine.createSpyObj('any', ['innerHTML']);
    service.textParams.currentMember = current;
    service.finishEdit();
    expect(spyRect).toHaveBeenCalled();
  });

  it('should call delete last character and reset values', () => {
    service.isFirstLetter = false;
    const current = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(current, 'innerHTML', { value: 'hey cest un test'});
    service.textParams.sentence[0] = current;
    service.finishEdit();
    expect(service.textParams.rendering).toEqual(false);
    expect(service.isText).toEqual(false);
    expect(service.isFirstWord).toEqual(true);
    expect(service.isFirstLetter).toEqual(true);
    expect(service.textParams.newY).toEqual(0);
    expect(service.currentPosition).toEqual(0);
    expect(service.currentLine).toEqual(0);
  });

  it('should update fontweight', () => {
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    service.textParams.fontStyle = 'bold';
    service.updateWeight();
    expect(renderer.setAttribute).toHaveBeenCalledTimes(1);
    const text = 'text';
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[text], TEXT.FONT_WEIGHT, 'bold');
  });

  it('should update fontStyle', () => {
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    service.textParams.fontStyle = 'italic';
    service.updateStyle();
    expect(renderer.setAttribute).toHaveBeenCalledTimes(1);
    const text = 'text';
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[text], TEXT.FONT_STYLE, 'italic');
  });

  it('should update font-family', () => {
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    service.textParams.fontFamily = 'Arial';
    service.updateFF();
    expect(renderer.setAttribute).toHaveBeenCalledTimes(1);
    const text = 'text';
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[text], TEXT.FONT_FAMILY, 'Arial');
  });

  it('should update alignement', () => {
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    service.textParams.align = 'middle';
    service.updateAlign();
    expect(renderer.setAttribute).toHaveBeenCalledTimes(1);
    const text = 'text';
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[text], TEXT.ALIGN, 'middle');
  });

  it('should do nothing first line', () => {
    service.currentLine = 0;
    service.moveUpText();
    expect(service.currentLine).toEqual(0);
  });

  it('should change add | to uppervalue in text', () => {
    const line = 5;
    service.currentLine = line;
    const current = jasmine.createSpyObj('any', ['innerHTML']);
    service.textParams.currentMember = current;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentence, 'innerHTML', { value: 'hey'});
    const currentSentenceUp = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentenceUp, 'innerHTML', { value: 'hola'});
    service.textParams.sentence[line] = currentSentence;
    service.textParams.sentence[line - 1] = currentSentenceUp;
    service.moveUpText();
    expect(service.currentLine).toEqual(line - 1);
    expect(service.textParams.sentence[line].innerHTML).toEqual('ey');
    expect(service.textParams.sentence[line - 1 ].innerHTML).toEqual('|hola');
  });

  it('should do nothing - lastline', () => {
    const line = 4;
    service.currentLine = line;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentence, 'length', { value: 5});
    service.textParams.sentence = currentSentence;
    service.moveDownText();
    expect(service.currentLine).toEqual(line);
  });

  it('should change add | to down value in text', () => {
    const line = 5;
    service.currentLine = line;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentence, 'length', { value: 5});

    const current = jasmine.createSpyObj('any', ['innerHTML']);
    service.textParams.currentMember = current;
    Object.defineProperty(currentSentence, 'innerHTML', { value: 'hey'});
    const currentSentenceDown = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentenceDown, 'innerHTML', { value: 'hola'});
    service.textParams.sentence[line] = currentSentence;
    service.textParams.sentence[line + 1] = currentSentenceDown;

    service.moveDownText();
    expect(service.currentLine).toEqual(line + 1);
    expect(service.textParams.sentence[line + 1].innerHTML).toEqual('|hola');
    expect(service.textParams.sentence[line].innerHTML).toEqual('ey');
  });

  it('should do nothing - last Position', () => {
    const pos = 5;
    service.currentPosition = pos;
    const line = 3;
    service.currentLine = line;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentence, 'innerHTML', { value: 'hello|'});
    service.textParams.sentence[service.currentLine] = currentSentence;
    service.moveRightText();
    expect(service.currentPosition).toEqual(pos);
    expect(service.textParams.sentence[line].innerHTML).toEqual('hello|');
  });

  it('should move placeholder to right', () => {
    const pos = 3;
    service.currentPosition = pos;
    const line = 3;
    service.currentLine = line;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentence, 'innerHTML', { value: 'hel|lo'});
    service.textParams.sentence[line] = currentSentence;
    service.moveRightText();
    expect(service.currentPosition).toEqual(pos + 1);
    expect(service.textParams.sentence[line].innerHTML).toEqual('hell|o');
  });

  it('should move placeholder to left', () => {
    const pos = 3;
    service.currentPosition = pos;
    const line = 3;
    service.currentLine = line;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentence, 'innerHTML', { value: 'hel|lo'});
    service.textParams.sentence[line] = currentSentence;
    const currentMem = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentence, 'innerHTML', { value: 'hello'});
    service.textParams.currentMember = currentMem;
    service.moveLeftText();
    expect(service.currentPosition).toEqual(pos - 1);
    expect(service.textParams.sentence[line].innerHTML).toEqual('hello');
  });

  it('should do nothing first character', () => {
    service.currentPosition = 0;
    const line = 3;
    service.currentLine = line;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentence, 'innerHTML', { value: '|hello'});
    service.textParams.sentence[line] = currentSentence;
    service.moveLeftText();
    expect(service.currentPosition).toEqual(0);
    expect(service.textParams.sentence[line].innerHTML).toEqual('|hello');
  });

  it('should finishEdit', () => {
    const currentMem = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentMem, 'innerHTML', { value: 'hel|lo'});
    service.textParams.currentMember = currentMem;
    const spyFinish = spyOn(service, 'finishEdit');
    service.cancelEdition();
    expect(service.textParams.currentMember.innerHTML).toEqual('');
    expect(spyFinish).toHaveBeenCalled();
  });

  it('should delete character on right', () => {
    const pos = 3;
    service.currentPosition = pos;
    const currentMem = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentMem, 'innerHTML', { value: 'hel|lo'});
    service.textParams.currentMember = currentMem;
    service.deleteNextCaracter();
    expect(service.textParams.currentMember.innerHTML).toEqual('hel|o');
  });

  it('should change current line and setAttributes for next line', () => {
    const pos = 3;
    service.currentPosition = pos;

    const currentMem = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentMem, 'innerHTML', { value: 'hello|'});
    service.textParams.currentMember = currentMem;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML', 'push']);
    service.textParams.sentence = currentSentence;
    service.textParams.sentence[0] = currentMem;
    const currentMem2 = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentMem2, 'innerHTML', { value: '|'});
    service.textParams.currentMember = currentMem2;
    service.textParams.sentence[1] = currentMem2;
    const mockStart = 10;
    const mockNew = 5;
    service.textParams.startX = mockStart;
    service.textParams.newY = mockNew;
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    service.changeLine();
    expect(renderer.appendChild).toHaveBeenCalled();
    const nbTimes = 2;
    expect(renderer.setAttribute).toHaveBeenCalledTimes(nbTimes);
  });

  it('should set svg text attributes', () => {
    const event = new MouseEvent('click');
    const rendererStr = 'renderer';
    service[rendererStr] = renderer;
    const currentMem = jasmine.createSpyObj('any', ['innerHTML']);
    service.textParams.currentMember = currentMem;

    const currentSentence = jasmine.createSpyObj('any', ['innerHTML', 'push']);
    service.textParams.sentence = currentSentence;
    service.textParams.sentence[0] = currentMem;
    const spy = spyOn(service, 'createRect');
    const mockOffsetX = 10;
    const mockOffsetY = 5;
    const colorServiceStr = 'colorService';
    service[colorServiceStr].primaryColor = 'black';
    spyOnProperty(event, 'offsetX').and.returnValue(mockOffsetX);
    spyOnProperty(event, 'offsetY').and.returnValue(mockOffsetY);
    service.setTextBox(event);
    expect(spy).toHaveBeenCalled();
    expect(renderer.appendChild).toHaveBeenCalled();
    const text = 'text';
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[text], TEXT.X, '10');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[text], TEXT.Y, '5');
    expect(renderer.setAttribute).toHaveBeenCalledWith(service[text], TEXT.FILL, 'black');
  });

  it('should delete all and put |', () => {

    const currentMem = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentMem, 'innerHTML', { value: 'Écrire ici!'});
    service.textParams.currentMember = currentMem;

    service.deletePreviousCaracter();
    expect(service.textParams.currentMember.innerHTML).toEqual('|');
  });

  it('should put |', () => {
    const current = jasmine.createSpyObj('any', ['innerHTML']);
    service.textParams.currentMember = current;

    service.currentLine = 0;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML', 'pop']);
    Object.defineProperty(currentSentence, 'length', { value: 1});
    Object.defineProperty(currentSentence, 'innerHTML', { value: '|'});
    service.textParams.sentence = currentSentence;

    const currentMem = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentMem, 'innerHTML', { value: '|'});
    service.textParams.sentence[0] = currentMem;

    service.deletePreviousCaracter();
    expect(service.textParams.sentence[0].innerHTML).toEqual('|');
  });

  it('should call pop', () => {
    const current = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(current, 'innerHTML', { value: 'HEY'});
    service.textParams.currentMember = current;

    service.currentLine = 1;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML', 'pop']);
    Object.defineProperty(currentSentence, 'length', { value: 2});
    service.textParams.sentence = currentSentence;

    const currentMem = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentMem, 'innerHTML', { value: '|'});
    service.textParams.sentence[1] = currentMem;

    const currentMem2 = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentMem2, 'innerHTML', { value: 'hey'});
    service.textParams.sentence[0] = currentMem;

    service.deletePreviousCaracter();
    expect(service.textParams.sentence[0].innerHTML).toEqual('|');
  });

  it('delete previous and change pos', () => {
    const current = jasmine.createSpyObj('any', ['innerHTML']);
    service.textParams.currentMember = current;

    service.currentLine = 1;
    const currentSentence = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentSentence, 'length', { value: 3});
    service.textParams.sentence = currentSentence;

    const currentMem = jasmine.createSpyObj('any', ['innerHTML']);
    Object.defineProperty(currentMem, 'innerHTML', { value: 'hey'});
    service.textParams.sentence[1] = currentMem;
    service.deletePreviousCaracter();
    expect(service.textParams.sentence[1].innerHTML).toEqual('|ey');
  });

// tslint:disable-next-line: max-file-line-count
});

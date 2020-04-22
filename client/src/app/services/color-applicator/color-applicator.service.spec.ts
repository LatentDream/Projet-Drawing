import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorApplicatorService } from './color-applicator.service';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*
*    /!\ AVERTISSEMENT /!\
*   Pas les meilleurs tests, mais car l'on ne peut pas envoyer directement
*   un path ou rect avec le localName n'étant pas undefined, ceux-ci vont
*   faire. Merci de votre compréhension
*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

describe('ColorApplicatorService', () => {
  let colorApplicatorService: ColorApplicatorService;
  // tslint:disable-next-line: no-any
  let mockRenderer: any;

  beforeEach(() => {
    mockRenderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'createElement', 'setAttribute']);
    TestBed.configureTestingModule({
      providers: [ColorApplicatorService, Renderer2]
    });
    colorApplicatorService = TestBed.get(ColorApplicatorService);
  }
  );

  it('should be created', () => {
    expect(colorApplicatorService).toBeTruthy();
  });

  it('should create a renderer', () => {
    const renderer = 'renderer';
    expect(colorApplicatorService[renderer]).toBeDefined();
  });

  it('should change the path color', () => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mockRenderer.setAttribute.and.callFake(() => { return; });
    const event: MouseEvent = new MouseEvent('mousedown');
    const spy = spyOnProperty(path, 'localName').and.returnValue('path');
    Object.defineProperty(event, 'target', { value: path });
    Object.defineProperty(event, 'button', { value: 0 });
    colorApplicatorService.mouseDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should not change the path color', () => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mockRenderer.setAttribute.and.callFake(() => { return; });
    const event: MouseEvent = new MouseEvent('mousedown');
    const spy = spyOnProperty(path, 'localName').and.returnValue('path');
    Object.defineProperty(event, 'target', { value: path });
    Object.defineProperty(event, 'button', { value: 2 });
    colorApplicatorService.mouseDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should change the fill color', () => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mockRenderer.setAttribute.and.callFake(() => { return; });
    const event: MouseEvent = new MouseEvent('mousedown');
    const spy = spyOnProperty(path, 'localName').and.returnValue('rect');
    Object.defineProperty(event, 'target', { value: path });
    Object.defineProperty(event, 'button', { value: 0 });
    colorApplicatorService.mouseDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should change the stroke color', () => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mockRenderer.setAttribute.and.callFake(() => { return; });
    const event: MouseEvent = new MouseEvent('mousedown');
    const spy = spyOnProperty(path, 'localName').and.returnValue('rect');
    Object.defineProperty(event, 'target', { value: path });
    Object.defineProperty(event, 'button', { value: 2 });
    colorApplicatorService.mouseDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should change the stroke color of polyline', () => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mockRenderer.setAttribute.and.callFake(() => { return; });
    const event: MouseEvent = new MouseEvent('mousedown');
    const spy = spyOnProperty(path, 'localName').and.returnValue('polyline');
    Object.defineProperty(event, 'target', { value: path });
    Object.defineProperty(event, 'button', { value: 0 });
    colorApplicatorService.mouseDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should change the stroke color of circle', () => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mockRenderer.setAttribute.and.callFake(() => { return; });
    const mockParentElement: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['setAttribute', 'owenerSVGElement']);
    Object.defineProperty(mockParentElement, 'localName', {value : 'g'});
    const event: MouseEvent = new MouseEvent('mousedown');
    Object.defineProperty(path, 'parentNode', {value: mockParentElement});
    const spy = spyOnProperty(path, 'localName').and.returnValue('circle');
    Object.defineProperty(event, 'target', { value: path });
    Object.defineProperty(event, 'button', { value: 0 });
    colorApplicatorService.mouseDown(event);
    expect(spy).toHaveBeenCalled();
  });

});

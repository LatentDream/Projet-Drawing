import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';

describe('ColorServiceService', () => {
  // tslint:disable-next-line: no-any
  let service: any; // type can be undefined and ColorService
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ColorService);
    });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add color to color queue', () => {
    service.addColor('rgba(255, 0, 0,1)', false);
    expect(service.queue.data[0]).toEqual('rgba(255, 0, 0,1)');
  });

  it('should not add a color duplicate to the history queue ', () => {
    service.addColor('rgba(255, 0, 0,1)', false);
    service.addColor('rgba(255, 0, 0,1)', false);
    expect(service.queue.data[1]).toEqual(undefined);
  });

  it('should not add color if transparency is changed', () => {
    service.addColor('rgba(255, 0, 0,1)', false);
    service.addColor('rgba(255, 0, 0,0.5)', true);
    expect(service.queue.data[1]).toEqual(undefined);
  });

  it('should remove color if already has 10 colors', () => {
    service.addColor('rgba(255, 0, 0,1)', false);
    service.addColor('rgba(254, 0, 0,1)', false);
    service.addColor('rgba(253, 0, 0,1)', false);
    service.addColor('rgba(252, 0, 0,1)', false);
    service.addColor('rgba(251, 0, 0,1)', false);
    service.addColor('rgba(255, 1, 0,1)', false);
    service.addColor('rgba(255, 2, 0,1)', false);
    service.addColor('rgba(255, 4, 0,1)', false);
    service.addColor('rgba(255, 3, 0,1)', false);
    service.addColor('rgba(255, 5, 0,1)', false);
    const spy = spyOn(service.queue, 'remove');
    service.addColor('rgba(255, 10, 0,1)', false);
    expect(spy).toHaveBeenCalled();
  });
});

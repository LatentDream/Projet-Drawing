import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextureComponent } from './texture.component';

describe('TextureComponent', () => {
  let component: TextureComponent;
  let fixture: ComponentFixture<TextureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

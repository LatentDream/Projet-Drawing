import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { UserGuideDescriptionComponent } from './user-guide-description.component';

describe('UserGuideDescriptionComponent', () => {
  let component: UserGuideDescriptionComponent;
  let fixture: ComponentFixture<UserGuideDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGuideDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuideDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Should display the content whit the same name of the input', () => {
    component.selectedSubject = 'Crayon';
    expect(fixture.debugElement.query(By.css(component.selectedSubject))).toBeDefined();
  });

});

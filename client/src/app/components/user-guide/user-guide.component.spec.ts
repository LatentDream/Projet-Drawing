import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { UserGuideComponent } from './user-guide.component';

describe('UserGuideComponent', () => {
  let component: UserGuideComponent;
  let fixture: ComponentFixture<UserGuideComponent>;
  const loc = jasmine.createSpyObj('Location', ['back', 'subscribe']);
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/my/app' }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Retrieve element
    debugElement = fixture.debugElement.query(By.css('.sideNavButton-container'));
  });

  it('should create User Guide', () => {
    expect(component).toBeTruthy();
  });

  it('Should open on the welcome poage', () => {
    const ug: UserGuideComponent = new UserGuideComponent(loc);
    expect(ug.subjectToDisplay).toEqual(ug.generalSubject[0]);
  });

  it('Should go on the next page with next()', () => {
    const ug: UserGuideComponent = new UserGuideComponent(loc);

    // Change category ( if and else if )
    ug.next();
    expect(ug.currentCategory).toEqual(ug.toolsSubject);
    ug.currentCategory = ug.toolsSubject;
    ug.subjectToDisplay = ug.currentCategory[ug.toolsSubject.length - 1];
    ug.next();
    expect(ug.currentCategory).toEqual(ug.optionsSubject);
    ug.currentCategory = ug.optionsSubject;
    ug.subjectToDisplay = ug.currentCategory[ug.currentCategory.length - 1];
    ug.next();
    expect(ug.subjectToDisplay).toEqual(ug.optionsSubject[ug.currentCategory.length - 1]);

    // Change subject in a category
    const i = 0;
    ug.subjectToDisplay = ug.currentCategory[i];
    ug.next();
    expect(ug.subjectToDisplay).toEqual(ug.currentCategory[i + 1]);
  });

  it('Should go on the precedent page with precedent()', () => {
    const ug: UserGuideComponent = new UserGuideComponent(loc);
    // Change in the current categry
    ug.currentCategory = ug.toolsSubject;
    ug.subjectToDisplay = ug.currentCategory[2];
    ug.precedent();
    expect(ug.subjectToDisplay).toEqual(ug.currentCategory[1]);

    // Change category ( if and else if )
    ug.currentCategory = ug.toolsSubject;
    ug.subjectToDisplay = ug.currentCategory[0];
    ug.precedent();
    expect(ug.currentCategory).toEqual(ug.generalSubject);
    ug.currentCategory = ug.optionsSubject;
    ug.subjectToDisplay = ug.currentCategory[0];
    ug.precedent();
    expect(ug.currentCategory).toEqual(ug.toolsSubject);
    ug.currentCategory = ug.generalSubject;
    ug.subjectToDisplay = ug.currentCategory[0];
    ug.precedent();
    expect(ug.subjectToDisplay).toEqual(ug.generalSubject[0]);
  });

  it('Should show all the subject in sideNav', () => {
    const ug: UserGuideComponent = new UserGuideComponent(loc);
    ug.showAllSubject();
    expect(ug.showTools).toEqual(true);
    expect(ug.showOptions).toEqual(true);
  });

  it('Should place the subject to display in subjectToDisplay when button call showInfo()', () => {
    component.showInfo(component.generalSubject[0], component.generalSubject);
    expect(component.currentCategory).toEqual(component.generalSubject);
    expect(component.subjectToDisplay).toEqual(component.generalSubject[0]);
  });

  it('Should hide or display one category at the time when a category is click', () => {
    component.showTools = true;
    debugElement.triggerEventHandler('change', {value: 'options'});
    expect(component.showTools).toEqual(false);
    debugElement.triggerEventHandler('change', {value: 'tools'});
    expect(component.showTools).toEqual(true);
    debugElement.triggerEventHandler('change', {value: 'welcome'});
    expect(component.showTools).toEqual(false);
  });

  it('Shoud go back to the previous page', () => {
    const ug: UserGuideComponent = new UserGuideComponent(loc);
    ug.backPage();
    expect(loc.back).toHaveBeenCalledTimes(1);
  });

});

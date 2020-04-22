import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonToggleChange} from '@angular/material';
import { BUTTONCATEGORY, SUBJECT } from '../enum';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent {
    // Controle attribute
    subButtonToggleValue: SUBJECT;
    buttonToggleValue: SUBJECT;
    subjectToDisplay: SUBJECT;
    showTools: boolean;
    showOptions: boolean;

    // Category and subject
    generalSubject: SUBJECT[];
    toolsSubject: SUBJECT[];
    optionsSubject: SUBJECT[];
    currentCategory: SUBJECT[];

  @Input() linkPrecedentPage: string;

  constructor(private location: Location) {
      // Controle attribute
  this.subButtonToggleValue = SUBJECT.NONE;
  this.buttonToggleValue = SUBJECT.WELCOME;
  this.subjectToDisplay  = this.buttonToggleValue;

  this.showTools = false;
  this.showOptions  = false;

  // Category and subject
  this.generalSubject = [SUBJECT.WELCOME];
  this.toolsSubject = [SUBJECT.PENCIL,
                  SUBJECT.BRUSH,
                  SUBJECT.LINE,
                  SUBJECT.AIRBRUSH,
                  SUBJECT.RECT,
                  SUBJECT.ELLIPSE,
                  SUBJECT.POLYGON,
                  SUBJECT.BUCKET,
                  SUBJECT.PIPETTE,
                  SUBJECT.APPLICATOR,
                  SUBJECT.SELECTION,
                  SUBJECT.GRID,
                  SUBJECT.ERASOR,
                  SUBJECT.TEXT];
  this.optionsSubject = [SUBJECT.CREATEDRAWING, SUBJECT.EXPORTDRAWING, SUBJECT.GALLERY, SUBJECT.SAVE];
  this.currentCategory = this.generalSubject;

  }

  // Side menu selector
  selectedCategory(event: MatButtonToggleChange): void {
    if (event.value === BUTTONCATEGORY.TOOLS) {
      this.showTools = true;
      this.showOptions = false;
    } else if (event.value === BUTTONCATEGORY.OPTIONS) {
      this.showTools = false;
      this.showOptions = true;
    } else {
      this.showTools = false;
      this.showOptions = false;
    }
  }

  showAllSubject(): void {
    this.showTools = true;
    this.showOptions = true;
  }

  // Send to child component the subject to display
  showInfo(subject: SUBJECT, category: SUBJECT[]): void {
    this.subjectToDisplay = subject;
    this.currentCategory = category;
  }

  // Precedent page
  precedent(): void {
    this.showAllSubject();

    // Change subject in the current category
    const index = this.currentCategory.indexOf(this.subjectToDisplay);
    if (index <= this.currentCategory.length && index > 0) {
      this.subjectToDisplay = this.currentCategory[index - 1];
      this.subButtonToggleValue = this.subjectToDisplay;
    }

    // Change to precedent category
    if (index === 0) {
      if (this.currentCategory === this.optionsSubject) {
        this.currentCategory = this.toolsSubject;
      } else if (this.currentCategory === this.toolsSubject) {
        this.currentCategory = this.generalSubject;
      } else {
        return;
      }
      this.subjectToDisplay = this.currentCategory[this.currentCategory.length - 1];
    }
  }

  // Next page
  next(): void {
    this.showAllSubject();
    const index = this.currentCategory.indexOf(this.subjectToDisplay);

    // Change subject in the current category
    if (index < this.currentCategory.length - 1 && index >= 0) {
      this.subjectToDisplay = this.currentCategory[index + 1];
      this.subButtonToggleValue = this.subjectToDisplay;
    }

    // Change to the next category
    if (index === this.currentCategory.length - 1) {
      if (this.currentCategory === this.generalSubject) {
        this.currentCategory = this.toolsSubject;
      } else if (this.currentCategory === this.toolsSubject) {
        this.currentCategory = this.optionsSubject;
      } else {
        return;
      }
      this.subjectToDisplay = this.currentCategory[0];
    }
  }

  backPage(): void {
    this.location.back();
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-guide-description',
  templateUrl: './user-guide-description.component.html',
  styleUrls: ['./user-guide-description.component.scss']
})
export class UserGuideDescriptionComponent {

  @Input() selectedSubject: string;

}

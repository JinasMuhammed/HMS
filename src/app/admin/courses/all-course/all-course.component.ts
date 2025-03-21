import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-all-course',
    templateUrl: './all-course.component.html',
    styleUrls: ['./all-course.component.scss'],
    imports: [BreadcrumbComponent, MatButtonModule]
})
export class AllCourseComponent {
  breadscrums = [
    {
      title: 'All Course',
      items: ['Course'],
      active: 'All Course',
    },
  ];
  constructor() {
    // constructor
  }
}

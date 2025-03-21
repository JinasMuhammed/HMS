import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-about-doctors',
    templateUrl: './about-doctors.component.html',
    styleUrls: ['./about-doctors.component.scss'],
    imports: [
        BreadcrumbComponent,
        MatTabsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
    ]
})
export class AboutTeacherComponent {
  breadscrums = [
    {
      title: 'Profile',
      items: ['doctors'],
      active: 'Profile',
    },
  ];
  constructor() {
    // constructor
  }
}

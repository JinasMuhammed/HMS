import { Route } from '@angular/router';
import { AllDoctersComponent } from './all-doctors/all-doctors.component';
import { AddTeacherComponent } from './add-doctors/add-doctors.component';
import { EditTeacherComponent } from './edit-doctors/edit-doctors.component';
import { AboutTeacherComponent } from './about-doctors/about-doctors.component';
import { Page404Component } from 'app/authentication/page404/page404.component';
// import { TeacherTimetableComponent } from './doctors-timetable/doctors-timetable.component';
import { AssignClassTeacherComponent } from './assign-class-teacher/assign-class-teacher.component';

export const ADMIN_DOCTOR_ROUTE: Route[] = [
  {
    path: 'all-doctors',
    component: AllDoctersComponent,
  },
  // {
  //   path: 'add-doctors',
  //   component: AddTeacherComponent,
  // },
  // {
  //   path: 'edit-doctors',
  //   component: EditTeacherComponent,
  // },
  // {
  //   path: 'about-doctors',
  //   component: AboutTeacherComponent,
  // },
  // {
  //   path: 'doctors-timetable',
  //   component: TeacherTimetableComponent,
  // },
  // {
  //   path: 'assign-class-teacher',
  //   component: AssignClassTeacherComponent,
  // },
  { path: '**', component: Page404Component },
];

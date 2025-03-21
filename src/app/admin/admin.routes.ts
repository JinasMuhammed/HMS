import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';

export const ADMIN_ROUTE: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
  },
  {
    path: 'frount-office',
    loadChildren: () =>
      import('./frount-office/frount-office.routes').then(
        (m) => m.FROUNT_OFFICE_ROUTE
      ),
  },

  {
    path: 'doctors',
    loadChildren: () =>
      import('./doctors/admin-doctors.routes').then(
        (m) => m.ADMIN_DOCTOR_ROUTE
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/admin-users.routes').then(
        (m) => m.ADMIN_USER_ROUTE
      ),
  },
  {
    path: 'students',
    loadChildren: () =>
      import('./students/admin-students.routes').then(
        (m) => m.ADMIN_STUDENT_ROUTE
      ),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./courses/courses.routes').then((m) => m.COURSE_ROUTE),
  },
  {
    path: 'library',
    loadChildren: () =>
      import('./library/library.routes').then((m) => m.LIBRARY_ROUTE),
  },
  {
    path: 'departments',
    loadChildren: () =>
      import('./departments/departments.routes').then(
        (m) => m.DEPARTMENT_ROUTE
      ),
  },
  {
    path: 'staff',
    loadChildren: () =>
      import('./staff/staff.routes').then((m) => m.STAFF_ROUTE),
  },
  {
    path: 'holidays',
    loadChildren: () =>
      import('./holidays/holidays.routes').then((m) => m.HOLIDAY_ROUTE),
  },
  {
    path: 'fees',
    loadChildren: () => import('./fees/fees.routes').then((m) => m.FEES_ROUTE),
  },
  {
    path: 'hostel',
    loadChildren: () =>
      import('./hostel/hostel.routes').then((m) => m.HOSTEL_ROUTE),
  },
  {
    path: 'class',
    loadChildren: () =>
      import('./class/class.routes').then((m) => m.CLASS_ROUTE),
  },
  {
    path: 'human-resources',
    loadChildren: () =>
      import('./human-resources/human-resources.routes').then(
        (m) => m.HR_ROUTE
      ),
  },
  { path: '**', component: Page404Component },
];

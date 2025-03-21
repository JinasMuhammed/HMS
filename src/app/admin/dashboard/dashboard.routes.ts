import { Route } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from 'app/admin/dashboard/dashboard/dashboard.component'
// import { DashboardComponent as StudentDashboard } from 'app/student/dashboard/dashboard.component';
// import { DashboardComponent } from 'app/teacher/dashboard/dashboard.component';
import { Page404Component } from 'app/authentication/page404/page404.component';
export const DASHBOARD_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  // {
  //   path: 'main',
  //   component: MainComponent,
  // },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  // {
  //   path: 'teacher-dashboard',
  //   component: DashboardComponent,
  // },
  // {
  //   path: 'student-dashboard',
  //   component: StudentDashboard,
  // },
  { path: '**', component: Page404Component },
];

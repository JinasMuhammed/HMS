import { Route } from '@angular/router';
import { AllAppoinmentsComponent } from './all-appointments/all-appointments.component';
import { Page404Component } from 'app/authentication/page404/page404.component';

export const APPOINMENTS_ROUTE: Route[] = [
  {
    path: 'all-appointments',
    component: AllAppoinmentsComponent,
  },

  { path: '**', component: Page404Component },
];

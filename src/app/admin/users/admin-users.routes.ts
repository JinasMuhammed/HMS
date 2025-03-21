import { Route } from '@angular/router';
import { AllUsersComponent } from './all-users/all-users.component';
import { Page404Component } from 'app/authentication/page404/page404.component';

export const ADMIN_USER_ROUTE: Route[] = [
  {
    path: 'all-users',
    component: AllUsersComponent,
  },

  { path: '**', component: Page404Component },
];

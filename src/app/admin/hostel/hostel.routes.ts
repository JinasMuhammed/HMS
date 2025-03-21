import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { HostelRoomListComponent } from './hostel-room-list/hostel-room-list.component';
import { HostelRoomTypeComponent } from './hostel-room-type/hostel-room-type.component';

export const HOSTEL_ROUTE: Route[] = [
  {
    path: 'room-list',
    component: HostelRoomListComponent,
  },
  {
    path: 'room-type',
    component: HostelRoomTypeComponent,
  },
  { path: '**', component: Page404Component },
];

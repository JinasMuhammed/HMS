import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AppointmentsService } from '../../appointments.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  patient_name: string;
  department: string;
  mobile: string;
}

@Component({
    selector: 'app-appointments-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ]
})
export class AppointmentsDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AppointmentsDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public AppointmentsService: AppointmentsService
  ) {}

  confirmDelete(): void {
    this.AppointmentsService.deleteAppointment(this.data.id).subscribe({
      next: (response: any) => {
        // handle success
      },
      error: (error: any) => {
        // handle error
      }
    });
  }
}

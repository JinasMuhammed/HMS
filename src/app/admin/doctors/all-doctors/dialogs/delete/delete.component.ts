import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DoctorService } from '../../doctors.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  name: string;
  department: string;
  mobile: string;
}

@Component({
    selector: 'app-teachers-delete',
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
export class DoctorsDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DoctorsDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public DoctorService: DoctorService
  ) {}

  confirmDelete(): void {
    this.DoctorService.deleteDoctor(this.data.id).subscribe({
      next: (response: any) => {
        // handle success
      },
      error: (error: any) => {
        // handle error
      }
    });
  }
}

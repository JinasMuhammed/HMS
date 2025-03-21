import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StaffAttendanceService } from '../../staff-attendance.service';

export interface DialogData {
  id: number;
  name: string;
  department: string;
}

@Component({
    selector: 'app-staffAttendance-delete',
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
export class StaffAttendanceDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<StaffAttendanceDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public staffAttendanceService: StaffAttendanceService
  ) {}

  confirmDelete(): void {
    this.staffAttendanceService.deleteStaffAttendance(this.data.id).subscribe({
      next: (response) => {
        // Handle successful deletion
        this.dialogRef.close(response); // Close the dialog with the response
        // Optionally, handle other UI actions like refreshing a list
      },
      error: (error) => {
        console.error('Delete Error:', error);
        // Handle error appropriately
      },
    });
  }
}

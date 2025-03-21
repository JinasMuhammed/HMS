import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { HolidayService } from '../../holiday.service';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
}

@Component({
    selector: 'app-all-holidays-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
        DatePipe,
    ]
})
export class AllHolidaysDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllHolidaysDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public holidayService: HolidayService
  ) {}

  onNoClick(): void {
    this.dialogRef.close(); // Close the dialog without action
  }

  confirmDelete(): void {
    this.holidayService.deleteHoliday(this.data.id).subscribe({
      next: (response) => {
        // Handle successful deletion
        this.dialogRef.close(response); // Close the dialog with the response
        // Optionally, refresh a list or show a notification
      },
      error: (error) => {
        console.error('Delete Error:', error);
        // Handle error appropriately
      },
    });
  }
}

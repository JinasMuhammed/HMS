import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { HostelRoomTypeService } from '../../hostel-room-type.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  roomTypeId: number;
  roomTypeName: string;
  roomCategory: string;
  roomPrice: string;
}

@Component({
  selector: 'app-all-hostelRoomTypes-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
})
export class AllHostelRoomTypesDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllHostelRoomTypesDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public hostelRoomTypeService: HostelRoomTypeService
  ) {}

  onNoClick(): void {
    this.dialogRef.close(); // Close the dialog without action
  }

  confirmDelete(): void {
    this.hostelRoomTypeService
      .deleteHostelRoomType(this.data.roomTypeId)
      .subscribe({
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

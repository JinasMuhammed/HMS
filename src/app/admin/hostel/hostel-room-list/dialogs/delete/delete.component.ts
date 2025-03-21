import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { HostelRoomListService } from '../../hostel-room-list.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  roomId: number;
  roomNumber: string;
  roomType: string;
  capacity: string;
}

@Component({
  selector: 'app-all-hostelRoomLists-delete',
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
export class AllHostelRoomListsDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllHostelRoomListsDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public hostelRoomListService: HostelRoomListService
  ) {}

  onNoClick(): void {
    this.dialogRef.close(); // Close the dialog without action
  }

  confirmDelete(): void {
    this.hostelRoomListService.deleteHostelRoom(this.data.roomId).subscribe({
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

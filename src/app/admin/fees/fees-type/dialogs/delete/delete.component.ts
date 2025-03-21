import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FeesTypeService } from '../../fees-type..service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  feeTypeId: number;
  feeTypeName: string;
  category: string;
  amount: string;
}

@Component({
  selector: 'app-all-feesTypes-delete',
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
export class AllFeesTypesDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllFeesTypesDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public feesTypeService: FeesTypeService
  ) {}

  onNoClick(): void {
    this.dialogRef.close(); // Close the dialog without action
  }

  confirmDelete(): void {
    this.feesTypeService.deleteFeesType(this.data.feeTypeId).subscribe({
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

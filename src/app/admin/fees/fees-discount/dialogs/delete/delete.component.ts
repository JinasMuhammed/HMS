import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FeesDiscountService } from '../../fees-discount..service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  discountId: number;
  discountType: string;
  discountPercentage: string;
}

@Component({
  selector: 'app-all-feesDiscounts-delete',
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
export class AllFeesDiscountsDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllFeesDiscountsDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public feesDiscountService: FeesDiscountService
  ) {}

  onNoClick(): void {
    this.dialogRef.close(); // Close the dialog without action
  }

  confirmDelete(): void {
    this.feesDiscountService
      .deleteFeesDiscount(this.data.discountId)
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

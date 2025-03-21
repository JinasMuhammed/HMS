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
import { AdmissionInquiryService } from '../../admission-inquiry.service';

export interface DialogData {
  inquiryId: number;
  studentName: string;
  contactNumber: string;
}

@Component({
    selector: 'app-admissionInquiry-delete',
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
export class AdmissionInquiryDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AdmissionInquiryDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public admissionInquiryService: AdmissionInquiryService
  ) {}

  confirmDelete(): void {
    this.admissionInquiryService
      .deleteAdmissionInquiry(this.data.inquiryId)
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

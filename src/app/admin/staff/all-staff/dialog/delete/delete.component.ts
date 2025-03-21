import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { StaffService } from '../../staff.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  name: string;
  designation: string;
  mobile: string;
}

@Component({
    selector: 'app-all-staff-delete',
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
export class AllStaffDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllStaffDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public staffService: StaffService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.staffService.deleteStaff(this.data.id);
  }
}

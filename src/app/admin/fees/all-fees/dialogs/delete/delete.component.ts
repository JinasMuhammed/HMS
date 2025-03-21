import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FeesService } from '../../fees.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  rollNo: string;
  studentName: string;
}

@Component({
  selector: 'app-all-fees-delete',
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
export class AllFeesDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllFeesDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public feesService: FeesService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.feesService.deleteFees(this.data.id);
  }
}

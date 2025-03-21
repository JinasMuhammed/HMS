import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UsersService } from '../../users.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  username: string;
  department: string;
  mobile: string;
}

@Component({
    selector: 'app-users-delete',
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
export class UsersDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<UsersDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public UsersService: UsersService
  ) {}

  confirmDelete(): void {
    this.UsersService.deleteUser(this.data.id).subscribe({
      next: (response: any) => {
        // handle success
      },
      error: (error: any) => {
        // handle error
      }
    });
  }
}

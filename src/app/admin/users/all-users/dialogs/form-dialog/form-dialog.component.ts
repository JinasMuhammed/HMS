import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UsersService } from '../../users.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Users } from '../../users.model';
import { formatDate } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { CommonModule } from '@angular/common';
export interface DialogData {
  id: number;
  action: string;
  Users: Users;
}

@Component({
    selector: 'app-Users-form',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        MatSelectModule,
        MatDialogClose,
        // FileUploadComponent,
        CommonModule
    ]
})
export class UsersFormComponent {
  action: string;
  dialogTitle: string;
  UserForm: UntypedFormGroup;
  Users: Users;
  errorMessage: string | null = null;
  constructor(
    public dialogRef: MatDialogRef<UsersFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public UsersService: UsersService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit' ? data.Users.username : 'New User';
    this.Users = this.action === 'edit' ? data.Users : new Users({});
    this.UserForm = this.createUserForm();
  }


  ngOnInit(): void {

  }

  createUserForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.Users?.id || null],  // User ID (optional, usually auto-generated)
      username: [this.Users?.username || '', [Validators.required]],  // Username
      email: [this.Users?.email || '', [Validators.required, Validators.email, Validators.minLength(5)]],  // Email
      password: [this.Users?.password || '', [Validators.required, Validators.minLength(6)]],  // Password
      email_status: [this.Users?.email_status || 'unverified'],  // Default status
      role: [this.Users?.role || 'user', Validators.required],  // Role (e.g., 'admin', 'user', etc.)
      firstName: [this.Users?.firstName || '', [Validators.required]],  // First Name
      lastName: [this.Users?.lastName || '', [Validators.required]],  // Last Name
    });
  }
  
  


  

  getErrorMessage(control: UntypedFormControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  // submit() {
  //   if (this.UserForm.valid) {
  //     const formData = this.UserForm.getRawValue();
  //     if (this.action === 'edit') {
  //       this.Userservice.updateUser(formData).subscribe({
  //         next: (response) => {
  //           this.dialogRef.close(response);
  //         },
  //         error: (error) => {
  //           console.error('Update Error:', error);
  //           // Optionally display an error message to the user
  //         },
  //       });
  //     } else {
  //       this.Userservice.addUser(formData).subscribe({
  //         next: (response) => {
  //           this.dialogRef.close(response);
  //         },
  //         error: (error) => {
  //           console.error('Add Error:', error);
  //           // Optionally display an error message to the user
  //         },
  //       });
  //     }
  //   }
  // }
  submit() {
    if (this.UserForm.valid) {
      const formData = this.UserForm.getRawValue();
  
      // Handle 'edit' or 'add' action
      if (this.action === 'edit') {
        this.UsersService.updateUser(this.Users.id, formData).subscribe({
          next: (response: Users) => {
            this.dialogRef.close(response);
          },
          error: (error: any) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.UsersService.addUser(formData).subscribe({
          next: (response: Users) => {
            this.dialogRef.close(response);
          },
          error: (error: any) => {
            console.error('Add Error:', error);
          },
        });
      }
    }
  }
  
  
  
  

  onNoClick(): void {
    this.UserForm.reset(); // Reset the form
    this.dialogRef.close();
  }
}

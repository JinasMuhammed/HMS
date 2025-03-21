import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DoctorService } from '../../doctors.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Doctors } from '../../doctors.model';
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
  Doctors: Doctors;
}

@Component({
    selector: 'app-Doctors-form',
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
        FileUploadComponent,
        CommonModule
    ]
})
export class DoctorsFormComponent {
  action: string;
  dialogTitle: string;
  DoctorForm: UntypedFormGroup;
  Doctors: Doctors;
  departments: any[] = [];
  errorMessage: string | null = null;
  constructor(
    public dialogRef: MatDialogRef<DoctorsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public DoctorService: DoctorService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit' ? data.Doctors.first_name : 'New Doctor';
    this.Doctors = this.action === 'edit' ? data.Doctors : new Doctors({});
    this.DoctorForm = this.createDoctorForm();
  }


  ngOnInit(): void {
    this.DoctorService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data; // Assign the department data
        console.log(this.departments)
      },
      error: (err) => {
        console.error('Error fetching departments', err);
        this.errorMessage = 'Could not load departments';
      },
    });
  }

  createDoctorForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.Doctors.id],
      first_name: [this.Doctors.first_name, [Validators.required]],
      last_name: [this.Doctors.last_name, [Validators.required]],
      email: [
        this.Doctors.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      dob: [
        this.Doctors.dob 
          ? formatDate(this.Doctors.dob, 'dd/MM/yyyy', 'en-US') 
          : '', // Format the 'dob' if it's available
        Validators.required,
      ], 
      gender: [this.Doctors.gender, Validators.required],   
      phone: [this.Doctors.phone || '', Validators.pattern(/^[0-9]{10,15}$/)], 
      address: [this.Doctors.address, Validators.required], 
      image: [this.Doctors.image, Validators.required], 
      department: [this.Doctors.department, Validators.required], 
      biography: [this.Doctors.biography || ''],  
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
  //   if (this.DoctorForm.valid) {
  //     const formData = this.DoctorForm.getRawValue();
  //     if (this.action === 'edit') {
  //       this.DoctorService.updatedoctor(formData).subscribe({
  //         next: (response) => {
  //           this.dialogRef.close(response);
  //         },
  //         error: (error) => {
  //           console.error('Update Error:', error);
  //           // Optionally display an error message to the user
  //         },
  //       });
  //     } else {
  //       this.DoctorService.adddoctor(formData).subscribe({
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
    if (this.DoctorForm.valid) {
      let formData = new FormData();
  
      // Loop over the form values and append them to FormData
      Object.keys(this.DoctorForm.value).forEach((key) => {
        const value = this.DoctorForm.get(key)?.value;
  
        if (key === 'dob' && value) {
          // Format the 'dob' to the correct format for backend (YYYY-MM-DD)
          const formattedDob = formatDate(value, 'yyyy-MM-dd', 'en-US');
          formData.append(key, formattedDob);
        } else if (key === 'image' && value instanceof File) {
          formData.append('image', value, value.name); 
        } else if (key === 'image' && !value) {
        } else {
          formData.append(key, value);
        }
      });
  
      if (this.action === 'edit') {
        this.DoctorService.updateDoctor(this.Doctors.id, formData).subscribe({
          next: (response: Doctors) => {
            this.dialogRef.close(response);
          },
          error: (error: any) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.DoctorService.addDoctor(formData).subscribe({
          next: (response: Doctors) => {
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
    this.DoctorForm.reset(); // Reset the form
    this.dialogRef.close();
  }
}

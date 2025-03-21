import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AppointmentsService } from '../../appointments.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Appointments } from '../../appointments.model';
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
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatTimepickerModule } from 'mat-timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Doctors } from  '../../../../admin/doctors/all-doctors/doctors.model';
export interface DialogData {
  id: number;
  action: string;
  Appointments: Appointments;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
    selector: 'app-Appointments-form',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },  // Set locale for DD/MM/YYYY
      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }  // Custom date formats
    ],
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
        CommonModule,
        MatNativeDateModule,
        MatTimepickerModule,
        NgxMaterialTimepickerModule,
    ]
})
export class AppointmentsFormComponent {
  action: string;
  dialogTitle: string;
  AppointmentsForm: UntypedFormGroup;
  Appointments: Appointments;
  errorMessage: string | null = null;
  departments: any[] = [];
   doctors: Doctors[] = [];
  constructor(
    public dialogRef: MatDialogRef<AppointmentsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public AppointmentsService: AppointmentsService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit' ? data.Appointments.patient_name : 'New User';
    this.Appointments = this.action === 'edit' ? data.Appointments : new Appointments({});
    this.AppointmentsForm = this.createAppointmentForm();
  }


  ngOnInit(): void {

        this.AppointmentsService.getDepartments().subscribe({
          next: (data) => {
            this.departments = data; // Assign the department data
            console.log(this.departments)
          },
          error: (err) => {
            console.error('Error fetching departments', err);
            this.errorMessage = 'Could not load departments';
          },
        });
        this.AppointmentsService.getDoctors().subscribe(
          (response: any) => {
            console.log(response); // Log the response to check its structure
            this.doctors = response.doctors; // Ensure doctors is an array
          },
          (error) => {
            console.error('Error fetching doctors:', error);
          }
        );
  }

  createAppointmentForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.Appointments?.id || null],  // Appointment ID (optional, usually auto-generated)
      patient_name: [this.Appointments?.patient_name || '', [Validators.required]],  // Patient Name
      department: [this.Appointments?.department || '', [Validators.required]],  // Department
      doctor_name: [this.Appointments?.doctor_name || '', [Validators.required]],  // Doctor Name
       date: [this.formatDateToDDMMYYYY(this.Appointments?.date) || '', [Validators.required]],  // Appointment Date
      time: [this.Appointments?.time || '', [Validators.required]],  // Appointment Time
      email: [this.Appointments?.email || '', [Validators.required, Validators.email]],  // Email
      phone: [this.Appointments?.phone || '', [Validators.required, Validators.minLength(10)]],  // Phone Number
    });
  }
  
  
  formatDateToDDMMYYYY(date: string | Date | null): string | null {
    if (!date) return null;
    return formatDate(date, 'dd/MM/yyyy', 'en-US');
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
  //   if (this.AppointmentsForm.valid) {
  //     const formData = this.AppointmentsForm.getRawValue();
  //     if (this.action === 'edit') {
  //       this.Appointmentservice.updateUser(formData).subscribe({
  //         next: (response) => {
  //           this.dialogRef.close(response);
  //         },
  //         error: (error) => {
  //           console.error('Update Error:', error);
  //           // Optionally display an error message to the user
  //         },
  //       });
  //     } else {
  //       this.Appointmentservice.addUser(formData).subscribe({
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
    if (this.AppointmentsForm.valid) {
      const formData = this.AppointmentsForm.getRawValue();
      formData.date = this.formatDateToDDMMYYYY(formData.date);
      // Handle 'edit' or 'add' action
      if (this.action === 'edit') {
        this.AppointmentsService.updateAppointment(this.Appointments.id, formData).subscribe({
          next: (response: Appointments) => {
            this.dialogRef.close(response);
          },
          error: (error: any) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.AppointmentsService.addAppointment(formData).subscribe({
          next: (response: Appointments) => {
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
    this.AppointmentsForm.reset(); // Reset the form
    this.dialogRef.close();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Appointments } from './appointments.model';

interface AppointmentsResponse {
  appointment: Appointments[];
}
@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private readonly API_URL = 'http://localhost:3000';
  dataChange: BehaviorSubject<Appointments[]> = new BehaviorSubject<Appointments[]>([]);

  constructor(private httpClient: HttpClient) {}


  getAllAppointments(): Observable<AppointmentsResponse> {
    console.log('Fetching appointments from API');
    return this.httpClient
      .get<AppointmentsResponse>(`${this.API_URL}/appointment`)
      .pipe(
        map((response) => response), // You can transform the response if needed
        catchError(this.handleError) // Handle errors from the API
      );
  }
  getDepartments(): Observable<any> {
    return this.httpClient.get<any>(this.API_URL+'/doctors/departments'); // Fetch departments
  }
  getDoctors(): Observable<any> {
    return this.httpClient.get<any>(this.API_URL+'/doctors'); // Fetch departments
  }

  // getDepartments(): Observable<any> {
  //   return this.httpClient.get<any>(this.API_URL+'/users/departments'); // Fetch departments
  // }


  addAppointment(formData: FormData): Observable<Appointments> {
    console.log(formData)
    return this.httpClient.post<Appointments>(`${this.API_URL}/appointment/add_appointment`, formData).pipe(
      map((response) => response), // Return the response from the API
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing doctor by ID */
  updateAppointment(id: number, formData: FormData): Observable<Appointments> {
    return this.httpClient.put<Appointments>(`${this.API_URL}/appointments/edit_appointment/${id}`, formData).pipe(
      map((response) => response), // Return the response from the API
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a doctor by ID */
  deleteAppointment(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}/appointment/delete_appointment/${id}`).pipe(
      map(() => id), // Return the ID of the deleted doctor
      catchError(this.handleError)
    );
  }

  /** Handle Http operation that failed */
  
  /** DELETE: Remove a doctor by ID */
  // deletedoctor(id: number): Observable<number> {
  //   return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
  //     map(() => {
  //       return id; // return the ID of the deleted doctor
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}

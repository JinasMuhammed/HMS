import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Doctors } from './doctors.model';

interface DoctorsResponse {
  doctors: Doctors[];
}
@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private readonly API_URL = 'http://localhost:3000';
  dataChange: BehaviorSubject<Doctors[]> = new BehaviorSubject<Doctors[]>([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all doctors */
  // getAlDoctors(): Observable<Doctors[]> {
  //   return this.httpClient
  //     .get<Doctors[]>(`${this.API_URL}/doctors`)
  //     .pipe(catchError(this.handleError));
  // }

  
  getAlDoctors(): Observable<DoctorsResponse> {
    return this.httpClient
      .get<DoctorsResponse>(this.API_URL + '/doctors')
      .pipe(catchError(this.handleError));
  }

  getDepartments(): Observable<any> {
    return this.httpClient.get<any>(this.API_URL+'/doctors/departments'); // Fetch departments
  }
  /** POST: Add a new doctor */
  // adddoctor(Doctors: Doctors): Observable<Doctors> {
  //   return this.httpClient.post<Doctors>(this.API_URL, Doctors).pipe(
  //     map((response) => {
  //       return Doctors; // return doctor from API
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  // /** PUT: Update an existing doctor */
  // updatedoctor(Doctors: Doctors): Observable<Doctors> {
  //   return this.httpClient.put<Doctors>(`${this.API_URL}`, Doctors).pipe(
  //     map((response) => {
  //       return Doctors; // return doctor from API
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  addDoctor(formData: FormData): Observable<Doctors> {
    return this.httpClient.post<Doctors>(`${this.API_URL}/doctors/add_doctor`, formData).pipe(
      map((response) => response), // Return the response from the API
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing doctor by ID */
  updateDoctor(id: number, formData: FormData): Observable<Doctors> {
    return this.httpClient.put<Doctors>(`${this.API_URL}/doctors/edit_doctor/${id}`, formData).pipe(
      map((response) => response), // Return the response from the API
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a doctor by ID */
  deleteDoctor(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}/doctors/delete_doctor/${id}`).pipe(
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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { StaffAttendance } from './staff-attendance.model';

@Injectable({
  providedIn: 'root',
})
export class StaffAttendanceService {
  private readonly API_URL = 'assets/data/staff-attendance.json';
  dataChange: BehaviorSubject<StaffAttendance[]> = new BehaviorSubject<
    StaffAttendance[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  /** CRUD METHODS */

  /** GET: Fetch all staff attendance records */
  getAllStaffAttendances(): Observable<StaffAttendance[]> {
    return this.httpClient.get<StaffAttendance[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data); // Update the BehaviorSubject with the new data
        return data; // Return the fetched data
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new staff attendance record */
  addStaffAttendance(attendance: StaffAttendance): Observable<StaffAttendance> {
    return this.httpClient.post<StaffAttendance>(this.API_URL, attendance).pipe(
      map((response) => {
        return attendance; // Return the added attendance data
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing staff attendance record */
  updateStaffAttendance(
    attendance: StaffAttendance
  ): Observable<StaffAttendance> {
    return this.httpClient
      .put<StaffAttendance>(`${this.API_URL}`, attendance)
      .pipe(
        map((response) => {
          return attendance; // Return the updated attendance data
        }),
        catchError(this.handleError)
      );
  }

  /** DELETE: Remove a staff attendance record by ID */
  deleteStaffAttendance(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted attendance record
      }),
      catchError(this.handleError)
    );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { LeaveRequest } from './leave-request.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  private readonly API_URL = 'assets/data/teacher-leave.json';
  dataChange: BehaviorSubject<LeaveRequest[]> = new BehaviorSubject<
    LeaveRequest[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  /** CRUD METHODS */

  /** GET: Fetch all leave requests */
  getAllLeaveRequests(): Observable<LeaveRequest[]> {
    return this.httpClient.get<LeaveRequest[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data); // Update the BehaviorSubject with the fetched data
        return data; // Return the fetched data
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new leave request */
  addLeaveRequest(leaveRequest: LeaveRequest): Observable<LeaveRequest> {
    return this.httpClient.post<LeaveRequest>(this.API_URL, leaveRequest).pipe(
      map((response) => {
        return leaveRequest; // Return the added leave request
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing leave request */
  updateLeaveRequest(leaveRequest: LeaveRequest): Observable<LeaveRequest> {
    return this.httpClient
      .put<LeaveRequest>(`${this.API_URL}`, leaveRequest)
      .pipe(
        map((response) => {
          return leaveRequest; // Return the updated leave request
        }),
        catchError(this.handleError)
      );
  }

  /** DELETE: Remove a leave request by ID */
  deleteLeaveRequest(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted leave request
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

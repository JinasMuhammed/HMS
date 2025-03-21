import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { LeaveRequest } from './leave-request.model'; // Ensure the correct file path
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/stdLeaveReq.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<LeaveRequest[]> = new BehaviorSubject<
    LeaveRequest[]
  >([]);

  constructor(private httpClient: HttpClient) {
    super();
  }

  /** CRUD METHODS */

  /** GET: Fetch all leave requests */

  getAllLeaveRequests(): Observable<LeaveRequest[]> {
    return this.httpClient
      .get<LeaveRequest[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new leave request */
  addLeaveRequest(leaveRequest: LeaveRequest): Observable<LeaveRequest> {
    return this.httpClient.post<LeaveRequest>(this.API_URL, leaveRequest).pipe(
      map((response) => {
        return leaveRequest;
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
          return leaveRequest;
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

  /** Handle HTTP errors */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}

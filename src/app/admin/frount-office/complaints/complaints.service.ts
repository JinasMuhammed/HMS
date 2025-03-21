import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Complaints } from './complaints.model';

@Injectable({
  providedIn: 'root',
})
export class ComplaintsService {
  private readonly API_URL = 'assets/data/complaint.json';

  dataChange: BehaviorSubject<Complaints[]> = new BehaviorSubject<Complaints[]>(
    []
  );

  dialogData!: Complaints;

  constructor(private httpClient: HttpClient) {}

  get data(): Complaints[] {
    return this.dataChange.value;
  }

  getDialogData(): Complaints {
    return this.dialogData;
  }

  /** CRUD METHODS */

  /** GET: Fetch all complaints */
  getComplaints(): Observable<Complaints[]> {
    return this.httpClient.get<Complaints[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new complaint */
  addComplaint(complaint: Complaints): Observable<Complaints> {
    return this.httpClient.post<Complaints>(this.API_URL, complaint).pipe(
      map(() => {
        this.dialogData = complaint;
        return complaint;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing complaint */
  updateComplaint(complaint: Complaints): Observable<Complaints> {
    return this.httpClient.put<Complaints>(`${this.API_URL}`, complaint).pipe(
      map(() => {
        this.dialogData = complaint;
        return complaint;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a complaint by ID */
  deleteComplaint(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id;
      }),
      catchError(this.handleError)
    );
  }

  /** GET: Search complaints by category */
  searchByCategory(category: string): Observable<Complaints[]> {
    return this.httpClient
      .get<Complaints[]>(`${this.API_URL}?category=${category}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  /** GET: Filter complaints by date range */
  filterByDateRange(startDate: Date, endDate: Date): Observable<Complaints[]> {
    return this.httpClient
      .get<Complaints[]>(
        `${
          this.API_URL
        }?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      )
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  /** GET: Filter complaints by status */
  filterByStatus(status: string): Observable<Complaints[]> {
    return this.httpClient
      .get<Complaints[]>(`${this.API_URL}?status=${status}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  /** GET: Get today's complaints */
  getTodayComplaints(): Observable<Complaints[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.httpClient
      .get<Complaints[]>(`${this.API_URL}?date=${today}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  /** POST: Resolve a complaint */
  resolveComplaint(
    complaintId: number,
    resolutionDetails: string
  ): Observable<Complaints> {
    return this.httpClient
      .post<Complaints>(`${this.API_URL}/resolve`, {
        complaintId,
        resolutionDetails,
      })
      .pipe(
        map((data) => {
          return data;
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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ExamSchedule } from './exam-schedule.model';

@Injectable({
  providedIn: 'root',
})
export class ExamScheduleService {
  private readonly API_URL = 'assets/data/examSchedule.json';
  dataChange: BehaviorSubject<ExamSchedule[]> = new BehaviorSubject<
    ExamSchedule[]
  >([]);
  constructor(private httpClient: HttpClient) {}

  /** CRUD METHODS */

  /** GET: Fetch all exam schedules */
  getAllExamSchedules(): Observable<ExamSchedule[]> {
    return this.httpClient.get<ExamSchedule[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data); // Update the BehaviorSubject with the fetched data
        return data; // Return the fetched data
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new exam schedule */
  addExamSchedule(examSchedule: ExamSchedule): Observable<ExamSchedule> {
    return this.httpClient.post<ExamSchedule>(this.API_URL, examSchedule).pipe(
      map((response) => {
        return examSchedule; // Return the added exam schedule
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing exam schedule */
  updateExamSchedule(examSchedule: ExamSchedule): Observable<ExamSchedule> {
    return this.httpClient
      .put<ExamSchedule>(`${this.API_URL}`, examSchedule)
      .pipe(
        map((response) => {
          return examSchedule; // Return the updated exam schedule
        }),
        catchError(this.handleError)
      );
  }

  /** DELETE: Remove an exam schedule by ID */
  deleteExamSchedule(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted exam schedule
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

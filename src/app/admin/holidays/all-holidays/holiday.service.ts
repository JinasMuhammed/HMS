import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Holiday } from './holiday.model';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private readonly API_URL = 'assets/data/holiday.json';
  dataChange: BehaviorSubject<Holiday[]> = new BehaviorSubject<Holiday[]>([]);

  constructor(private httpClient: HttpClient) {}

  /** CRUD METHODS */

  /** GET: Fetch all holidays */
  getAllHolidays(): Observable<Holiday[]> {
    return this.httpClient.get<Holiday[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new holiday */
  addHoliday(holiday: Holiday): Observable<Holiday> {
    return this.httpClient.post<Holiday>(this.API_URL, holiday).pipe(
      map(() => holiday), // Return the added holiday
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing holiday */
  updateHoliday(holiday: Holiday): Observable<Holiday> {
    return this.httpClient.put<Holiday>(`${this.API_URL}`, holiday).pipe(
      map(() => holiday), // Return the updated holiday
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a holiday by ID */
  deleteHoliday(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => id), // Return the ID of the deleted holiday
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

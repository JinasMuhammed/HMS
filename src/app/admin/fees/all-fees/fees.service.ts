import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Fees } from './fees.model';

@Injectable({
  providedIn: 'root',
})
export class FeesService {
  private readonly API_URL = 'assets/data/fees.json';
  dataChange: BehaviorSubject<Fees[]> = new BehaviorSubject<Fees[]>([]);

  constructor(private httpClient: HttpClient) {}
  /** CRUD METHODS */

  /** GET: Fetch all fees */
  getAllFees(): Observable<Fees[]> {
    return this.httpClient.get<Fees[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new fee */
  addFees(fees: Fees): Observable<Fees> {
    return this.httpClient.post<Fees>(this.API_URL, fees).pipe(
      map(() => {
        return fees; // Return the added fee
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing fee */
  updateFees(fees: Fees): Observable<Fees> {
    return this.httpClient.put<Fees>(`${this.API_URL}`, fees).pipe(
      map(() => {
        return fees; // Return the updated fee
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a fee by ID */
  deleteFees(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted fee
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

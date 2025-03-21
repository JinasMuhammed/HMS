import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Homework } from './homework.model';

@Injectable({
  providedIn: 'root',
})
export class HomeworkService {
  private readonly API_URL = 'assets/data/stdHomework.json';

  dataChange: BehaviorSubject<Homework[]> = new BehaviorSubject<Homework[]>([]);

  constructor(private httpClient: HttpClient) {}

  /** CRUD METHODS */

  /** GET: Fetch all homework */
  getAllHomework(): Observable<Homework[]> {
    return this.httpClient.get<Homework[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new homework */
  addHomework(homework: Homework): Observable<Homework> {
    return this.httpClient.post<Homework>(this.API_URL, homework).pipe(
      map((response) => {
        return homework;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing homework */
  updateHomework(homework: Homework): Observable<Homework> {
    return this.httpClient.put<Homework>(`${this.API_URL}`, homework).pipe(
      map((response) => {
        return homework;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a homework by ID */
  deleteHomework(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted homework
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

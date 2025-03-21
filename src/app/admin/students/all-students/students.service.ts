import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Students } from './students.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private readonly API_URL = 'assets/data/students.json';
  dataChange: BehaviorSubject<Students[]> = new BehaviorSubject<Students[]>([]);

  constructor(private httpClient: HttpClient) {}

  get data(): Students[] {
    return this.dataChange.value;
  }

  getDialogData(): Students {
    return this.dialogData;
  }

  dialogData!: Students;

  /** CRUD METHODS */

  /** GET: Fetch all students */
  getAllStudents(): Observable<Students[]> {
    return this.httpClient
      .get<Students[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new student */
  addStudent(student: Students): Observable<Students> {
    return this.httpClient.post<Students>(this.API_URL, student).pipe(
      map(() => student), // Return the added student
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing student */
  updateStudent(student: Students): Observable<Students> {
    return this.httpClient.put<Students>(`${this.API_URL}`, student).pipe(
      map(() => student), // Return the updated student
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a student by ID */
  deleteStudent(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => id), // Return the ID of the deleted student
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

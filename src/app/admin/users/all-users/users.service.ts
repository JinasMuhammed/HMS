import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Users } from './users.model';

interface UsersResponse {
  users: Users[];
}
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API_URL = 'http://localhost:3000';
  dataChange: BehaviorSubject<Users[]> = new BehaviorSubject<Users[]>([]);

  constructor(private httpClient: HttpClient) {}


  getAllUsers(): Observable<UsersResponse> {
    console.log('Fetching users from API');
    return this.httpClient
      .get<UsersResponse>(`${this.API_URL}/users`)
      .pipe(
        map(response => response), 
        catchError(this.handleError) 
      );
  }
  
 

  // getDepartments(): Observable<any> {
  //   return this.httpClient.get<any>(this.API_URL+'/users/departments'); // Fetch departments
  // }


  addUser(formData: FormData): Observable<Users> {
    console.log(formData)
    return this.httpClient.post<Users>(`${this.API_URL}/users/add`, formData).pipe(
      map((response) => response), // Return the response from the API
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing doctor by ID */
  updateUser(id: number, formData: FormData): Observable<Users> {
    return this.httpClient.put<Users>(`${this.API_URL}/users/edit/${id}`, formData).pipe(
      map((response) => response), // Return the response from the API
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a doctor by ID */
  deleteUser(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}/users/delete/${id}`).pipe(
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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HostelRoomType } from './hostel-room-type.model';

@Injectable({
  providedIn: 'root',
})
export class HostelRoomTypeService {
  private readonly API_URL = 'assets/data/hostel-room-type.json';
  dataChange: BehaviorSubject<HostelRoomType[]> = new BehaviorSubject<
    HostelRoomType[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  /** CRUD METHODS */

  /** GET: Fetch all hostel room types */
  getHostelRoomTypes(): Observable<HostelRoomType[]> {
    return this.httpClient.get<HostelRoomType[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new hostel room type */
  addHostelRoomType(
    hostelRoomType: HostelRoomType
  ): Observable<HostelRoomType> {
    return this.httpClient
      .post<HostelRoomType>(this.API_URL, hostelRoomType)
      .pipe(
        map(() => hostelRoomType), // Return the added hostel room type
        catchError(this.handleError)
      );
  }

  /** PUT: Update an existing hostel room type */
  updateHostelRoomType(
    hostelRoomType: HostelRoomType
  ): Observable<HostelRoomType> {
    return this.httpClient
      .put<HostelRoomType>(`${this.API_URL}`, hostelRoomType)
      .pipe(
        map(() => hostelRoomType), // Return the updated hostel room type
        catchError(this.handleError)
      );
  }

  /** DELETE: Remove a hostel room type by ID */
  deleteHostelRoomType(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => id), // Return the ID of the deleted hostel room type
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

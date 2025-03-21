import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { FeesType } from './fees-type..model';

@Injectable({
  providedIn: 'root',
})
export class FeesTypeService {
  private readonly API_URL = 'assets/data/fees-type.json';

  dataChange: BehaviorSubject<FeesType[]> = new BehaviorSubject<FeesType[]>([]);

  dialogData!: FeesType;

  constructor(private httpClient: HttpClient) {}

  get data(): FeesType[] {
    return this.dataChange.value;
  }

  getDialogData(): FeesType {
    return this.dialogData;
  }

  /** CRUD METHODS */

  /** GET: Fetch all fees types */
  getAllFeesTypes(): Observable<FeesType[]> {
    return this.httpClient.get<FeesType[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new fees type */
  addFeesType(feesType: FeesType): Observable<FeesType> {
    return this.httpClient.post<FeesType>(this.API_URL, feesType).pipe(
      map(() => {
        this.dialogData = feesType;
        return feesType;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing fees type */
  updateFeesType(feesType: FeesType): Observable<FeesType> {
    return this.httpClient.put<FeesType>(`${this.API_URL}`, feesType).pipe(
      map(() => {
        this.dialogData = feesType;
        return feesType;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a fees type by ID */
  deleteFeesType(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id;
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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AdmissionInquiry } from './admission-inquiry.model';

@Injectable({
  providedIn: 'root',
})
export class AdmissionInquiryService {
  private readonly API_URL = 'assets/data/admission-inquiries.json';

  dataChange: BehaviorSubject<AdmissionInquiry[]> = new BehaviorSubject<
    AdmissionInquiry[]
  >([]);

  dialogData!: AdmissionInquiry;

  constructor(private httpClient: HttpClient) {}

  get data(): AdmissionInquiry[] {
    return this.dataChange.value;
  }

  getDialogData(): AdmissionInquiry {
    return this.dialogData;
  }

  /** CRUD METHODS */

  /** GET: Fetch admission inquiries */
  getAdmissionInquiries(): Observable<AdmissionInquiry[]> {
    return this.httpClient.get<AdmissionInquiry[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new admission inquiry */
  addAdmissionInquiry(
    admissionInquiry: AdmissionInquiry
  ): Observable<AdmissionInquiry> {
    return this.httpClient
      .post<AdmissionInquiry>(this.API_URL, admissionInquiry)
      .pipe(
        map(() => {
          this.dialogData = admissionInquiry;
          return admissionInquiry;
        }),
        catchError(this.handleError)
      );
  }

  /** PUT: Update an existing admission inquiry */
  updateAdmissionInquiry(
    admissionInquiry: AdmissionInquiry
  ): Observable<AdmissionInquiry> {
    return this.httpClient
      .put<AdmissionInquiry>(`${this.API_URL}`, admissionInquiry)
      .pipe(
        map(() => {
          this.dialogData = admissionInquiry;
          return admissionInquiry;
        }),
        catchError(this.handleError)
      );
  }

  /** DELETE: Remove an admission inquiry by ID */
  deleteAdmissionInquiry(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id;
      }),
      catchError(this.handleError)
    );
  }

  /** GET: Search admission inquiries by reference number */
  searchByReferenceNo(referenceNo: string): Observable<AdmissionInquiry[]> {
    return this.httpClient
      .get<AdmissionInquiry[]>(`${this.API_URL}?ref=${referenceNo}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  /** GET: Filter admission inquiries by status */
  filterByStatus(status: string): Observable<AdmissionInquiry[]> {
    return this.httpClient
      .get<AdmissionInquiry[]>(`${this.API_URL}?status=${status}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  /** GET: Filter admission inquiries by date range */
  filterByDateRange(
    startDate: Date,
    endDate: Date
  ): Observable<AdmissionInquiry[]> {
    return this.httpClient
      .get<AdmissionInquiry[]>(
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

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}

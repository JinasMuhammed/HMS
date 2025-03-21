import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public apiUrl = 'http://localhost:3000'; // Your Node.js API URL

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    console.log('Calling API:', this.apiUrl);
    return this.http.get<any>(`${this.apiUrl}/home`).pipe(
      tap((response) => console.log('API Response:', response)),
      catchError((error) => {
        // Log the full error to inspect its structure
        console.error('Full API Error:', error);

        // Extract error message if available
        const errorMsg = error?.message || error?.statusText || 'Unknown API error';
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}









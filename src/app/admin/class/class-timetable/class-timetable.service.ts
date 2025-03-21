import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassTimetableService {
  constructor(private http: HttpClient) {}

  getTimetable(): Observable<any> {
    return this.http.get('/assets/data/class-timetable.json');
  }
}

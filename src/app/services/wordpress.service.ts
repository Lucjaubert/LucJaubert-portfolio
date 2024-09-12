// homepage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHomepageData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/homepage`);
  }
}

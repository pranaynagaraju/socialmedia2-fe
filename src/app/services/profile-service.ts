import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;
  email: string = "";
  password: string = "";

  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('username:password')
    });
    return { headers: headers };
  }

  signup(profile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, profile);
  }

  getUserDetails(email: string, password: string): Observable<any> {
    const token = localStorage.getItem('token');
    let headers: HttpHeaders;
  
    if (token) {
      headers = new HttpHeaders({
        'Authorization': `Basic ${token}`
      });
    } else {
      const basicAuthToken = btoa(`${email}:${password}`);
      headers = new HttpHeaders({
        'Authorization': `Basic ${basicAuthToken}`
      });
      console.log('Generated Basic Auth Token:', basicAuthToken);
    }
  
    return this.http.get<any>(`${this.apiUrl}/user-details`, {
      headers,
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('Error fetching user details:', error);
        return throwError(() => new Error('Failed to fetch user details'));
      })
    );
  }
  
  authenticate(): Observable<any> {
    const url = `${this.apiUrl}/authenticate`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + localStorage.getItem('token')
    });

    return this.http.get<any>(url, {
      headers,
      withCredentials: true
    });
  }


  getUserProfile(uid: string): Observable<any> {
    const token = localStorage.getItem('token');
    let headers: HttpHeaders=new HttpHeaders();
  
    if (token) {
      headers = new HttpHeaders({
        'Authorization': `Basic ${token}`
      });
    }

    return this.http.get<any>(`${this.apiUrl}/user-profile`, {
      headers,
      withCredentials: true,
      params: { uid }
    });
  }

  searchUserProfile(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + localStorage.getItem('token')
    });
    return this.http.get<any>(`${this.apiUrl}/search`, {
      headers,
      withCredentials: true,
      params: { q: query }
    });
    // return this.http.get<any>(`${this.apiUrl}/search`, {
    //   params: { q: query }
    // });
  }
}
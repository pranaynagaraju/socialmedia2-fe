import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment'

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private apiUrl = environment.apiUrl; // Fetch API URL from the environment
    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<any> {
        const url = `${this.apiUrl}/api/post/get-all-posts`;
        const headers = new HttpHeaders({
            'Authorization': 'Basic ' + btoa(`${email}:${password}`)
        });
    
        return this.http.get<any>(url,  { 
            headers,
            withCredentials: true
        }).pipe(
            catchError(this.handleError)
        );
    }

    logout(): Observable<any> {
        const url = `${this.apiUrl}/logout`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, {}, { headers }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Something went wrong, please try again later.'));
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
    providedIn: 'root',
})
export class AiCharacterService {
    private apiUrl = `${environment.apiUrl}/api/ai-characters`;

    constructor(private http: HttpClient) {}

    getAiCharacters(): Observable<any> {
            const headers = new HttpHeaders({
              'Authorization': 'Basic ' + localStorage.getItem('token')
          });
        return this.http.get(`${this.apiUrl}/get-ai-characters`, { 
            headers,
            withCredentials: true
        });
    }

    setAiCharacters(data: any): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': 'Basic ' + localStorage.getItem('token')
        });
        return this.http.post(`${this.apiUrl}/set-ai-characters?value=${encodeURIComponent(data)}`, null, {
            headers: headers,
            withCredentials: true,
            responseType: 'text' as 'json'
        });
    }
}
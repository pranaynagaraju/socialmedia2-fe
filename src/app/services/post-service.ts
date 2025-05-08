import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/api/post`;

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + localStorage.getItem('token')
  });
    return this.http.get<any>(`${this.apiUrl}/get-all-posts`, { 
      headers,
      withCredentials: true
  });
  }

  uploadImage(file: File, postText: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + localStorage.getItem('token')
  });
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('postText', postText);

    return this.http.post<any>(`${this.apiUrl}/upload`, formData,
      { 
      headers,
      responseType: 'text' as 'json',
      withCredentials: true});
  }

  likePost(postId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + localStorage.getItem('token')
  });
    return this.http.post<any>(`${this.apiUrl}/like`, null, {
      headers,
      withCredentials: true,
      responseType: 'text' as 'json',
      params: { postId: postId.toString() }
    });
  }

  savePost(postId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + localStorage.getItem('token')
  });
    return this.http.post<any>(`${this.apiUrl}/save`, null, {
      headers,
      withCredentials: true,
      responseType: 'text' as 'json',
      params: { postId: postId }
    });
  }

  getPostDetails(postId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + localStorage.getItem('token')
  });
    return this.http.get<any>(`${this.apiUrl}/get-post-details`, {
      headers,
      withCredentials: true,
      params: { postId: postId.toString() }
    });
  }

  addComment(postId: number, comment: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + localStorage.getItem('token')
  });
    return this.http.post<any>(`${this.apiUrl}/add-comment`, null, {
      headers,
      withCredentials: true,
      responseType: 'text' as 'json',
      params: { postId: postId.toString(), comment }
    });
  }
}
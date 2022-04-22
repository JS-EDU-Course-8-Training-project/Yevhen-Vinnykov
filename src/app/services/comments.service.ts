import { Observable, pluck } from 'rxjs';
import { IComment } from '../models/IComment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  })
};

interface INewComment {
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private baseURL: string = environment.apiURL;


  constructor(private http: HttpClient) { }

  fetchArticleComments(slug: string): Observable<IComment[]> {
    return this.http.get<{ comments: IComment[] }>(`${this.baseURL}/articles/${slug}/comments`, httpOptions).pipe(pluck('comments'));
  }
  createComment(slug: string, comment: INewComment): Observable<IComment> {
    return this.http.post<IComment>(`${this.baseURL}/articles/${slug}/comments`, JSON.stringify({ comment }), httpOptions);
  }
  removeComment(slug: string, id: number): Observable<IComment> {
    return this.http.delete<IComment>(`${this.baseURL}/articles/${slug}/comments/${id}`, httpOptions);
  }
}

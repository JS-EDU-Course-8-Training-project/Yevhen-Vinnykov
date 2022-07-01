import { Observable, pluck, tap } from 'rxjs';
import { IComment } from '../../../../shared/models/IComment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'accept': 'application/json',
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
  constructor(
    private http: HttpClient
  ) { }

  public fetchArticleComments(slug: string): Observable<IComment[] | HttpErrorResponse> {
    return this.http
      .get<{ comments: IComment[] }>(`${this.baseURL}/articles/${slug}/comments`, httpOptions)
      .pipe(
        pluck('comments'),
      );
  }

  public createComment(slug: string, comment: INewComment): Observable<IComment | HttpErrorResponse> {
    return this.http
      .post<IComment>(`${this.baseURL}/articles/${slug}/comments`, JSON.stringify({ comment }), httpOptions);
  }

  public removeComment(slug: string, id: string): Observable<IComment | HttpErrorResponse> {
    return this.http
      .delete<IComment>(`${this.baseURL}/articles/${slug}/comments/${id}`, httpOptions);
  }
}

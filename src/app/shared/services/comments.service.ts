import { catchError, Observable, pluck } from 'rxjs';
import { IComment } from '../models/IComment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';

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
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  public fetchArticleComments(slug: string): Observable<IComment[] | HttpErrorResponse> {
    return this.http
      .get<{ comments: IComment[] }>(`${this.baseURL}/articles/${slug}/comments`, httpOptions)
      .pipe(
        pluck('comments'),
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public createComment(slug: string, comment: INewComment): Observable<IComment | HttpErrorResponse> {
    return this.http
      .post<IComment>(`${this.baseURL}/articles/${slug}/comments`, JSON.stringify({ comment }), httpOptions)
      .pipe(
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public removeComment(slug: string, id: number): Observable<IComment | HttpErrorResponse> {
    return this.http
      .delete<IComment>(`${this.baseURL}/articles/${slug}/comments/${id}`, httpOptions)
      .pipe(
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }
}

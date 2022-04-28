import { IUpdateArticle } from '../../models/IUpdateArticle';
import { ICreatedArticle } from '../../models/ICreatedArticle';
import { IArticle, IArticleResponse } from '../../models/IArticle';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, pluck, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'accept': 'application/json',
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private baseURL: string = `${environment.apiURL}/articles`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  public fetchArticles(offset: number = 0, limit: number = 5): Observable<IArticleResponse | HttpErrorResponse> {
    return this.http.get<IArticleResponse>(`${this.baseURL}/?offset=${offset}&limit=${limit}`, httpOptions)
      .pipe(
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public fetchFollowedArticles(offset: number = 0, limit: number = 5): Observable<IArticleResponse | HttpErrorResponse> {
    return this.http.get<IArticleResponse>(`${this.baseURL}/feed/?offset=${offset}&limit=${limit}`, httpOptions)
      .pipe(
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public fetchArticle(slug: string): Observable<IArticle | HttpErrorResponse> {
    return this.http.get<{ article: IArticle }>(`${this.baseURL}/${slug}`, httpOptions)
      .pipe(
        pluck('article'),
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public createArticle(article: ICreatedArticle): Observable<ICreatedArticle | HttpErrorResponse> {
    return this.http
      .post<ICreatedArticle>(this.baseURL, JSON.stringify({ article }), httpOptions)
      .pipe(
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public deleteArticle(slug: string): Observable<Object> {
    return this.http.delete(`${this.baseURL}/${slug}`, httpOptions)
      .pipe(
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public updateArticle(slug: string, article: IUpdateArticle): Observable<IArticle | HttpErrorResponse> {
    return this.http.put<IArticle>(`${this.baseURL}/${slug}`, JSON.stringify({ article }), httpOptions)
      .pipe(
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public fetchTags(): Observable<string[] | HttpErrorResponse> {
    return this.http.get<{ tags: string[] }>(this.baseURL.replace('articles', 'tags'), httpOptions).pipe(
      pluck('tags'),
      catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
    );
  }

  public fetchArticlesByTag(tag: string, offset: number = 0, limit: number = 5):
    Observable<IArticleResponse | HttpErrorResponse> {
    return this.http.get<IArticleResponse>(`${this.baseURL}?tag=${tag}&limit=${limit}&offset=${offset}`, httpOptions)
      .pipe(
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );;
  }

  public fetchUserArticles(username: string, limit: number = 20, offset: number = 0):
    Observable<IArticleResponse | HttpErrorResponse> {
    return this.http
      .get<IArticleResponse>(`${this.baseURL}?author=${username}&limit=${limit}&offset=${offset}`, httpOptions)
      .pipe(
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public fetchFavoritedArticles(username: string, limit: number = 20, offset: number = 0):
    Observable<IArticleResponse | HttpErrorResponse> {
    return this.http
      .get<IArticleResponse>(`${this.baseURL}?favorited=${username}&limit=${limit}&offset=${offset}`, httpOptions)
      .pipe(
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public addToFavorites(slug: string): Observable<IArticle | HttpErrorResponse> {
    return this.http.post<{ article: IArticle }>(`${this.baseURL}/${slug}/favorite`, null, httpOptions)
      .pipe(
        pluck('article'),
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public removeFromFavorites(slug: string): Observable<IArticle | HttpErrorResponse> {
    return this.http.delete<{ article: IArticle }>(`${this.baseURL}/${slug}/favorite`, httpOptions)
      .pipe(
        pluck('article'),
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }
}



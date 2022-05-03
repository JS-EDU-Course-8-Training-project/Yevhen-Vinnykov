import { IUpdateArticle } from '../../models/IUpdateArticle';
import { ICreatedArticle } from '../../models/ICreatedArticle';
import { IArticle, IArticleResponse } from '../../models/IArticle';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pluck } from 'rxjs';
import { environment } from 'src/environments/environment';

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
    private http: HttpClient
  ) { }

  public fetchArticles(offset: number = 0, limit: number = 5): Observable<IArticleResponse | HttpErrorResponse> {
    return this.http.get<IArticleResponse>(`${this.baseURL}/?offset=${offset}&limit=${limit}`, httpOptions);
  }

  public fetchFollowedArticles(offset: number = 0, limit: number = 5): Observable<IArticleResponse | HttpErrorResponse> {
    return this.http.get<IArticleResponse>(`${this.baseURL}/feed/?offset=${offset}&limit=${limit}`, httpOptions);
  }

  public fetchArticle(slug: string): Observable<IArticle | HttpErrorResponse> {
    return this.http.get<{ article: IArticle }>(`${this.baseURL}/${slug}`, httpOptions)
      .pipe(pluck('article'));
  }

  public createArticle(article: ICreatedArticle): Observable<IArticle | HttpErrorResponse> {
    return this.http
      .post<IArticle>(this.baseURL, JSON.stringify({ article }), httpOptions);
  }

  public deleteArticle(slug: string): Observable<Object> {
    return this.http.delete(`${this.baseURL}/${slug}`, httpOptions);
  }

  public updateArticle(slug: string, article: IUpdateArticle): Observable<IArticle | HttpErrorResponse> {
    return this.http.put<IArticle>(`${this.baseURL}/${slug}`, JSON.stringify({ article }), httpOptions);
  }

  public fetchTags(): Observable<string[] | HttpErrorResponse> {
    return this.http.get<{ tags: string[] }>(this.baseURL.replace('articles', 'tags'), httpOptions)
      .pipe(pluck('tags'));
  }

  public fetchArticlesByTag(tag: string, offset: number = 0, limit: number = 5):
    Observable<IArticleResponse | HttpErrorResponse> {
    return this.http
      .get<IArticleResponse>(`${this.baseURL}?tag=${tag}&limit=${limit}&offset=${offset}`, httpOptions);
  }

  public fetchUserArticles(username: string, limit: number = 20, offset: number = 0):
    Observable<IArticleResponse | HttpErrorResponse> {
    return this.http
      .get<IArticleResponse>(`${this.baseURL}?author=${username}&limit=${limit}&offset=${offset}`, httpOptions);
  }

  public fetchFavoritedArticles(username: string, limit: number = 20, offset: number = 0):
    Observable<IArticleResponse | HttpErrorResponse> {
    return this.http
      .get<IArticleResponse>(`${this.baseURL}?favorited=${username}&limit=${limit}&offset=${offset}`, httpOptions);
  }

  public addToFavorites(slug: string): Observable<IArticle | HttpErrorResponse> {
    return this.http.post<{ article: IArticle }>(`${this.baseURL}/${slug}/favorite`, null, httpOptions)
      .pipe(pluck('article'));
  }

  public removeFromFavorites(slug: string): Observable<IArticle | HttpErrorResponse> {
    return this.http.delete<{ article: IArticle }>(`${this.baseURL}/${slug}/favorite`, httpOptions)
      .pipe(pluck('article'));
  }
}



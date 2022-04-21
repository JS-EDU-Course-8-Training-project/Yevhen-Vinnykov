import { IUpdateArticle } from './../models/IUpdateArticle';
import { ICreatedArticle } from './../models/ICreatedArticle';
import { IArticle, IArticleResponse } from './../models/IArticle';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pluck } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  // private baseURL: string = 'https://api.realworld.io/api/articles';
  private baseURL: string = 'http://localhost:3000/api/articles';
  isAuthorized: boolean = localStorage.getItem('authorized') === 'true';

  constructor(private http: HttpClient) {
  }
  fetchArticles(): Observable<IArticleResponse> {
    if (this.isAuthorized) {
      return this.http.get<IArticleResponse>(this.baseURL, httpOptions);
    }
    return this.http.get<IArticleResponse>(this.baseURL);
  }
  fetchFollowedArticles(): Observable<IArticleResponse> {
    return this.http.get<IArticleResponse>(`${this.baseURL}/feed`, httpOptions);
  }
  fetchArticle(slug: string): Observable<IArticle> {
    if (this.isAuthorized) {
      return this.http.get<{ article: IArticle }>(`${this.baseURL}/${slug}`, httpOptions).pipe(pluck('article'));
    }
    return this.http.get<{ article: IArticle }>(`${this.baseURL}/${slug}`).pipe(pluck('article'));
  }
  createArticle(article: ICreatedArticle): Observable<ICreatedArticle | HttpErrorResponse> {
    return this.http.post<ICreatedArticle | HttpErrorResponse>(this.baseURL, JSON.stringify({ article }), httpOptions);
  }
  deleteArticle(slug: string): any { // fix the type
    return this.http.delete(`${this.baseURL}/${slug}`, httpOptions); // CHECK ONCE THE API IS BACK UP
  }
  updateArticle(slug: string, article: IUpdateArticle): Observable<IArticle> {
    return this.http.put<IArticle>(`${this.baseURL}/${slug}`, JSON.stringify({ article }), httpOptions); // CHECK ONCE THE API IS BACK UP
  }
  fetchTags(): Observable<string[]> {
    if (this.isAuthorized) {
      return this.http.get<{ tags: string[] }>(this.baseURL.replace('articles', 'tags'), httpOptions).pipe(pluck('tags'));
    }
    return this.http.get<{ tags: string[] }>(this.baseURL.replace('articles', 'tags')).pipe(pluck('tags'));
  }
  fetchArticlesByTag(tag: string): Observable<IArticleResponse> {
    if (this.isAuthorized) {
      return this.http.get<IArticleResponse>(`${this.baseURL}?tag=${tag}`, httpOptions);
    }
    return this.http.get<IArticleResponse>(`${this.baseURL}?tag=${tag}`);
  }

  fetchUserArticles(username: string, limit: number = 20, offset: number = 0): Observable<IArticleResponse> {
    return this.http.get<IArticleResponse>(`${this.baseURL}?author=${username}&limit=${limit}&offset=${offset}`, httpOptions);
  }

  fetchFavoritedArticles(username: string, limit: number = 20, offset: number = 0): Observable<IArticleResponse> {
    return this.http.get<IArticleResponse>(`${this.baseURL}?favorited=${username}&limit=${limit}&offset=${offset}`, httpOptions);
  }

  addToFavorites(slug: string): Observable<IArticle> {
    return this.http.post<{ article: IArticle }>(`${this.baseURL}/${slug}/favorite`, null, httpOptions).pipe(pluck('article'));
  }
  removeFromFavorites(slug: string): Observable<IArticle> {
    return this.http.delete<{ article: IArticle }>(`${this.baseURL}/${slug}/favorite`, httpOptions).pipe(pluck('article'));
  }
}



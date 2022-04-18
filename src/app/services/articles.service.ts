import { ICreatedArticle } from './../models/ICreatedArticle';
import { IComment } from './../models/IComment';
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
  private baseURL: string = 'https://api.realworld.io/api/articles';
  isAuthorized: boolean = localStorage.getItem('authorized') === 'true';

  constructor(private http: HttpClient) {
  }
  fetchArticles(): Observable<IArticleResponse> {
    if(this.isAuthorized){
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
  fetchArticleComments(slug: string): Observable<IComment[]> {
    return this.http.get<{ comments: IComment[] }>(`${this.baseURL}/${slug}/comments`).pipe(pluck('comments'));
  }
  createArticle(article: ICreatedArticle): Observable<ICreatedArticle | HttpErrorResponse> {
    return this.http.post<ICreatedArticle | HttpErrorResponse>(this.baseURL, JSON.stringify({ article }), httpOptions);
  }
  fetchTags(): Observable<string[]> {
    return this.http.get<{ tags: string[] }>(this.baseURL.replace('articles', 'tags')).pipe(pluck('tags'));
  }
  fetchArticlesByTag(tag: string): Observable<IArticleResponse> {
    if(this.isAuthorized){
      return this.http.get<IArticleResponse>(`${this.baseURL}?tag=${tag}`, httpOptions);
    }
    return this.http.get<IArticleResponse>(`${this.baseURL}?tag=${tag}`);
  }
  addToFavorites(slug: string): Observable<IArticle> {
    return this.http.post<{ article: IArticle }>(`${this.baseURL}/${slug}/favorite`, null, httpOptions).pipe(pluck('article'));
  }
  removeFromFavorites(slug: string): Observable<IArticle> {
    return this.http.delete<{ article: IArticle }>(`${this.baseURL}/${slug}/favorite`, httpOptions).pipe(pluck('article'));
  }
}



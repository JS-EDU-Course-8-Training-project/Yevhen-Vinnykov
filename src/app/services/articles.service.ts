import { IComment } from './../models/IComment';
import { IArticle, IArticleResponse } from './../models/IArticle';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pluck } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private baseURL: string = 'https://api.realworld.io/api/articles';

  constructor(private http: HttpClient) { 
  }
  fetchArticles(): Observable<IArticleResponse> {
    return this.http.get<IArticleResponse>(this.baseURL);
  }
  fetchArticle(slug: string): Observable<IArticle> {
   return this.http.get<{article: IArticle}>(`${this.baseURL}/${slug}`).pipe(pluck('article'));
  }
  fetchArticleComments(slug: string): Observable<IComment[]> {
    return this.http.get<{comments: IComment[]}>(`${this.baseURL}/${slug}/comments`).pipe(pluck('comments'));
  }
}



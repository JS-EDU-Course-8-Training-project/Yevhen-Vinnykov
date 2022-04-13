import { IArticleResponse } from './../models/IArticle';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}

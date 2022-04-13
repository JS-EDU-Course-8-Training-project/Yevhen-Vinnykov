import { IArticle, IArticleResponse } from './../models/IArticle';
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
  fetchArticle(slug: string): Observable<IArticle> {
   return this.http.get<IArticle>(`${this.baseURL}/${slug}`);
  }
}


// getData(): Promise<any[]> {
//   return new Promise<any[]>(resolve => {
//     this.http.get('https://api.myjson.com/bins/18qku4').subscribe(data => {
//       this._categories = Array.from(Object.keys(data), k => data[k]);
//       console.log("load data...");
//       resolve(this._categories);
//     });
//   });
// }
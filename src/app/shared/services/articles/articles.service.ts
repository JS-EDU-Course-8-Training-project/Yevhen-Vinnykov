import { IUpdateArticle } from '../../models/IUpdateArticle';
import { IArticle, IArticleResponse } from '../../models/IArticle';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, pluck } from 'rxjs';
import { environment } from 'src/environments/environment';
import { INewArticle } from '../../models/INewArticle';

const httpOptions = {
  headers: new HttpHeaders({
    accept: 'application/json',
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private baseURL = `${environment.apiURL}/articles`;

  constructor(private http: HttpClient) {}

  public async fetchArticles(offset = 0, limit = 5): Promise<IArticleResponse> {
    const source$ = this.http.get<IArticleResponse>(
      `${this.baseURL}/?offset=${offset}&limit=${limit}`,
      httpOptions
    );

    return await firstValueFrom(source$);
  }

  public async fetchFollowedArticles(
    offset = 0,
    limit = 5
  ): Promise<IArticleResponse> {
    const source$ = this.http.get<IArticleResponse>(
      `${this.baseURL}/feed/?offset=${offset}&limit=${limit}`,
      httpOptions
    );

    return await firstValueFrom(source$);
  }

  public fetchArticle(slug: string): Observable<IArticle> {
    return this.http
      .get<{ article: IArticle }>(`${this.baseURL}/${slug}`, httpOptions)
      .pipe(pluck('article'));
  }

  public createArticle(article: INewArticle): Observable<IArticle> {
    return this.http
      .post<{ article: IArticle }>(this.baseURL, { article }, httpOptions)
      .pipe(pluck('article'));
  }

  public deleteArticle(slug: string): Observable<{}> {
    return this.http.delete<{}>(`${this.baseURL}/${slug}`, httpOptions);
  }

  public updateArticle(
    slug: string,
    article: IUpdateArticle
  ): Observable<IArticle> {
    return this.http
      .put<{ article: IArticle }>(
        `${this.baseURL}/${slug}`,
        { article },
        httpOptions
      )
      .pipe(pluck('article'));
  }

  public fetchTags(): Observable<string[]> {
    return this.http
      .get<{ tags: string[] }>(
        this.baseURL.replace('articles', 'tags'),
        httpOptions
      )
      .pipe(pluck('tags'));
  }

  public async fetchArticlesByTag(
    tag: string,
    offset = 0,
    limit = 5
  ): Promise<IArticleResponse> {
    const source$ = this.http.get<IArticleResponse>(
      `${this.baseURL}?tag=${tag}&limit=${limit}&offset=${offset}`,
      httpOptions
    );

    return await firstValueFrom(source$);
  }

  public async fetchUserArticles(
    username: string,
    offset = 0,
    limit = 20
  ): Promise<IArticleResponse> {
    const source$ = this.http.get<IArticleResponse>(
      `${this.baseURL}?author=${username}&limit=${limit}&offset=${offset}`,
      httpOptions
    );

    return await firstValueFrom(source$);
  }

  public async fetchFavoritedArticles(
    username: string,
    offset = 0,
    limit = 20
  ): Promise<IArticleResponse> {
    const source$ = this.http.get<IArticleResponse>(
      `${this.baseURL}?favorited=${username}&limit=${limit}&offset=${offset}`,
      httpOptions
    );

    return await firstValueFrom(source$);
  }

  public addToFavorites(slug: string): Observable<IArticle> {
    return this.http
      .post<{ article: IArticle }>(
        `${this.baseURL}/${slug}/favorite`,
        null,
        httpOptions
      )
      .pipe(pluck('article'));
  }

  public removeFromFavorites(slug: string): Observable<IArticle> {
    return this.http
      .delete<{ article: IArticle }>(
        `${this.baseURL}/${slug}/favorite`,
        httpOptions
      )
      .pipe(pluck('article'));
  }
}

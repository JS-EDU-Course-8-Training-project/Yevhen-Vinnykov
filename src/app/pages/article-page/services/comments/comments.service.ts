import { firstValueFrom, pluck } from 'rxjs';
import { IComment } from '../../../../shared/models/IComment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    accept: 'application/json',
    'Content-Type': 'application/json',
  }),
};

interface INewComment {
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private baseURL: string = environment.apiURL;
  constructor(private http: HttpClient) {}

  public async fetchArticleComments(slug: string): Promise<IComment[]> {
    const source$ = this.http
      .get<{ comments: IComment[] }>(
        `${this.baseURL}/articles/${slug}/comments`,
        httpOptions
      )
      .pipe(pluck('comments'));

    return firstValueFrom(source$);
  }

  public async createComment(
    slug: string,
    comment: INewComment
  ): Promise<IComment> {
    const source$ = this.http.post<IComment>(
      `${this.baseURL}/articles/${slug}/comments`,
      { comment },
      httpOptions
    );

    return firstValueFrom(source$);
  }

  public removeComment(slug: string, id: string): Promise<IComment> {
    const source$ = this.http.delete<IComment>(
      `${this.baseURL}/articles/${slug}/comments/${id}`,
      httpOptions
    );

    return firstValueFrom(source$);
  }
}

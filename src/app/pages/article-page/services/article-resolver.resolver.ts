/* eslint-disable @typescript-eslint/no-unused-vars */
import { IArticle } from 'src/app/shared/models/IArticle';
import { ArticlesService } from './../../../shared/services/articles/articles.service';
import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleResolver implements Resolve<IArticle> {
  constructor(private articlesService: ArticlesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IArticle> {
    return this.articlesService.fetchArticle(route.params['slug']);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IArticle } from 'src/app/shared/models/IArticle';

@Injectable()
export class ArticlesStore {
  public readonly articles$ = new BehaviorSubject<IArticle[]>([]);

  public get articles(): IArticle[] {
    return this.articles$.getValue();
  }
}

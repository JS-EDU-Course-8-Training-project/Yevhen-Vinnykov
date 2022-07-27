import { IArticleResponse } from '../../models/IArticle';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IArticle } from 'src/app/shared/models/IArticle';
import { IOptions, StoreConfigurator } from './store-config';

@Injectable()
export class ArticlesStore {
  readonly articles$ = new BehaviorSubject<IArticle[]>([]);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
  readonly loadedAllArticles$ = new BehaviorSubject<boolean>(false);
  readonly error$ = new BehaviorSubject<string>('');

  public offset = 0;
  public limit = 5;
  private currentPage = 1;
  private pagesTotalCount = 1;

  public useArticlesService!: () => Promise<IArticleResponse>;

  get articles(): IArticle[] {
    return this.articles$.getValue();
  }

  get loadedAllArticles(): boolean {
    return this.loadedAllArticles$.getValue();
  }

  get error(): string {
    return this.error$.getValue();
  }

  constructor(private storeConfig: StoreConfigurator) {}

  public useForArticles(options: IOptions) {
    this.reset();
    this.storeConfig.configure(this, options);
  }

  public async getArticles(): Promise<void> {
    if (this.loadedAllArticles) return;

    this.error$.next('');
    this.isLoading$.next(true);

    try {
      const { articles, articlesCount } = await this.useArticlesService();
      this.handleResponse(articles, articlesCount);
    } catch (error) {
      this.error$.next(error as string);
    } finally {
      this.isLoading$.next(false);
    }
  }

  private handleResponse(articles: IArticle[], articlesCount: number): void {
    this.pagesTotalCount = Math.ceil(articlesCount / this.limit) || 1;
    this.articles$.next([...this.articles$.getValue(), ...articles]);

    if (this.currentPage === this.pagesTotalCount) {
      this.loadedAllArticles$.next(true);
      return;
    }

    this.currentPage++;
    this.offset += this.limit;
  }

  public reset(): void {
    this.articles$.next([]);
    this.loadedAllArticles$.next(false);

    this.offset = 0;
    this.currentPage = 1;
    this.pagesTotalCount = 1;
  }
}

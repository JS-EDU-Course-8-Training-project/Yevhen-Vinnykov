import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IArticle } from 'src/app/shared/models/IArticle';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';

@Injectable()
export class GlobalArticlesStore {
  readonly articles$ = new BehaviorSubject<IArticle[]>([]);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
  readonly loadedAllArticles$ = new BehaviorSubject<boolean>(false);
  readonly error$ = new BehaviorSubject<string>('');

  private offset = 0;
  private currentPage = 1;
  private pagesTotalCount = 1;
  private limit = 5;

  get articles(): IArticle[] {
    return this.articles$.getValue();
  }

  get loadedAllArticles(): boolean {
    return this.loadedAllArticles$.getValue();
  }

  get error(): string {
    return this.error$.getValue();
  }

  constructor(private articlesService: ArticlesService) {}

  public async getArticles(): Promise<void> {
    if (this.loadedAllArticles) return;

    this.error$.next('');
    this.isLoading$.next(true);

    try {
      const { articles, articlesCount } =
        await this.articlesService.fetchArticles(this.offset, this.limit);

      this.handleResponse(articles, articlesCount);
    } catch (error) {
      this.error$.next(error as string);
    } finally {
      this.isLoading$.next(false);
    }
  }

  private handleResponse(articles: IArticle[], articlesCount: number): void {
    this.pagesTotalCount = Math.ceil(articlesCount / this.limit);
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

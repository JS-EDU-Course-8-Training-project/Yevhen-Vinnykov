import { IArticle } from './../../shared/models/IArticle';
import { IArticleResponse } from 'src/app/shared/models/IArticle';
import { Component, OnInit } from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { ArticlesStore } from '../../shared/services/articles/articles.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ArticlesStore],
})
export class HomeComponent extends TestedComponent implements OnInit {
  public isAuthorized = this.authService.isAuthorized$.getValue();

  public selectedTag!: string;
  public tabIndex = 0;
  
  public isLoading!: boolean;
  public currentPage = 0;
  public pagesTotalCount = 0;
  private offset = 0;
  private limit = 5;
  public error!: string;

  constructor(
    private authService: AuthorizationService,
    public store: ArticlesStore,
    private articlesService: ArticlesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadArticles();
  }

  public async loadArticles(): Promise<void> {
    this.isLoading = true;
    try {
      let response!: IArticleResponse;
      if (this.tabIndex === 1 || !this.isAuthorized) {
        response = await this.getGlobalFeed();
      }
      if (this.tabIndex === 0 && this.isAuthorized) {
        response = await this.getYourFeed();
      }
      if (this.tabIndex === 2) {
        response = await this.getTaggedArticles();
      }

      this.onResponse(response.articles, response.articlesCount);
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private async getGlobalFeed(): Promise<IArticleResponse> {
    return await this.articlesService.fetchArticles(this.offset, this.limit);
  }

  private async getYourFeed(): Promise<IArticleResponse> {
    return await this.articlesService.fetchFollowedArticles(
      this.offset,
      this.limit
    );
  }

  private async getTaggedArticles(): Promise<IArticleResponse> {
    return await this.articlesService.fetchArticlesByTag(
      this.selectedTag,
      this.offset,
      this.limit
    );
  }

  private onResponse(articles: IArticle[], articlesCount: number): void {
    this.isLoading = false;
    this.pagesTotalCount = Math.ceil(articlesCount / this.limit) || 1;
    this.store.articles$.next([...this.store.articles, ...articles]);

    if (this.currentPage === this.pagesTotalCount) return;
    this.currentPage++;
    this.offset += this.limit;
  }

  private onCatchError(error: string): void {
    this.isLoading = false;
    this.error = error;
  }

  public handleSelectTag(tag: string) {
    this.selectedTag = tag;
    this.handleTabChange(2);
  }

  public handleTabChange(index: number): void {
    this.tabIndex = index;
    this.reset();
    this.loadArticles();

    if (index !== 2) {
      this.selectedTag = '';
    }
  }

  private reset(): void {
    this.store.articles$.next([]);

    this.offset = 0;
    this.currentPage = 0;
    this.pagesTotalCount = 0;
  }
}

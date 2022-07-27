import { Injectable } from '@angular/core';
import { ArticlesService } from './articles.service';
import { ArticlesStore } from './articles.store';

export interface IOptions {
  global?: boolean;
  followed?: boolean;
  tag?: string | null;
  createdBy?: string;
  favoritedBy?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StoreConfigurator {
  private store!: ArticlesStore;
  constructor(private articlesService: ArticlesService) {}

  public configure(store: ArticlesStore, options: IOptions): void {
    this.store = store;

    if (options.global) {
      this.asGlobalArticlesStore();
    }
    if (options.followed) {
      this.asFollowedArticlesStore();
    }
    if (options.tag) {
      this.asTaggedArticleStore(options.tag);
    }

    if (options.createdBy) {
      this.asCreatedByArticlesStore(options.createdBy);
    }

    if (options.favoritedBy) {
      this.asFavoritedByArticlesStore(options.favoritedBy);
    }
  }

  private asGlobalArticlesStore() {
    this.store.useArticlesService = () =>
      this.articlesService.fetchArticles(this.store.offset, this.store.limit);
  }

  private asFollowedArticlesStore() {
    this.store.useArticlesService = () =>
      this.articlesService.fetchFollowedArticles(
        this.store.offset,
        this.store.limit
      );
  }

  private asTaggedArticleStore(tag: string) {
    this.store.useArticlesService = () =>
      this.articlesService.fetchArticlesByTag(
        tag,
        this.store.offset,
        this.store.limit
      );
  }

  private asCreatedByArticlesStore(author: string) {
    this.store.useArticlesService = () =>
      this.articlesService.fetchUserArticles(
        author,
        this.store.offset,
        this.store.limit
      );
  }

  private asFavoritedByArticlesStore(username: string) {
    this.store.useArticlesService = () =>
      this.articlesService.fetchFavoritedArticles(
        username,
        this.store.offset,
        this.store.limit
      );
  }
}

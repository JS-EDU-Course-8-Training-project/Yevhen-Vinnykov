import { Component, Input, OnInit } from '@angular/core';
import { IArticle } from 'src/app/shared/models/IArticle';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { LikeButtonStore } from './like-button.store';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss', '../buttons.scss'],
})
export class LikeButtonComponent implements OnInit {
  @Input() isAuth!: boolean;
  @Input() article!: IArticle;

  constructor(
    private redirectionService: RedirectionService,
    private articlesService: ArticlesService,
    public store: LikeButtonStore
  ) {}

  ngOnInit(): void {
    this.store.isLiked$.next(this.article.favorited);
    this.store.likesCount$.next(this.article.favoritesCount);
  }

  public async like(slug: string): Promise<void> {
    if (!this.isAuth) return this.redirectionService.redirectUnauthorized();

    this.store.isLoading$.next(true);

    const { favorited, favoritesCount } =
      await this.articlesService.addToFavorites(slug);
    this.store.isLiked$.next(favorited);
    this.store.likesCount$.next(favoritesCount);

    this.store.isLoading$.next(false);
  }

  public async dislike(slug: string): Promise<void> {
    if (!this.isAuth) return this.redirectionService.redirectUnauthorized();

    this.store.isLoading$.next(true);

    const { favorited, favoritesCount } =
      await this.articlesService.removeFromFavorites(slug);
    this.store.isLiked$.next(favorited);
    this.store.likesCount$.next(favoritesCount);

    this.store.isLoading$.next(false);
  }
}

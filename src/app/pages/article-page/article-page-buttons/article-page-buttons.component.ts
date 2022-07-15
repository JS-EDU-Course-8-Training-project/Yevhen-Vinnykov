import { Subject, takeUntil } from 'rxjs';
import {
  ArticlePageButtonsService,
  IButtonsState,
} from '../services/buttons/article-page-buttons.service';
import { AuthorizationService } from '../../../shared/services/authorization/authorization.service';
import { IArticle } from 'src/app/shared/models/IArticle';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { ProfilesService } from 'src/app/shared/services/profiles/profiles.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { HttpErrorResponse } from '@angular/common/http';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-article-page-buttons',
  templateUrl: './article-page-buttons.component.html',
  styleUrls: ['./article-page-buttons.component.scss'],
})
export class ArticlePageButtonsComponent
  extends TestedComponent
  implements OnChanges, OnDestroy
{
  @Input() article!: IArticle;
  @Input() slug!: string;
  @Input() authUser!: IExistingUser;

  public favoriteInProgress!: boolean;
  public followingInProgress!: boolean;
  public isLiked!: boolean;
  public likesCount!: number;
  public isFollowed!: boolean;
  public username!: string;
  public isAuthor!: boolean;
  private isAuthorized!: boolean;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService,
    private profilesService: ProfilesService,
    private authorizationService: AuthorizationService,
    private articlePageButtonsService: ArticlePageButtonsService,
    private redirectionService: RedirectionService
  ) {
    super();
  }

  ngOnChanges(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private initialize(): void {
    this.username = this.article?.author?.username;
    this.isAuthor = this.article?.author?.username === this.authUser?.username;

    if (!this.isAuthor && this.article) {
      this.articlePageButtonsService
        .initialize(this.article)
        .pipe(takeUntil(this.notifier))
        .subscribe((state) => this.setDataOnResponse(state));
    }

    this.authorizationService.isAuthorized$
      .pipe(takeUntil(this.notifier))
      .subscribe((isAuthorized) => (this.isAuthorized = isAuthorized));
  }

  private setDataOnResponse(state: IButtonsState) {
    this.followingInProgress = state.followingInProgress;
    this.favoriteInProgress = state.favoriteInProgress;
    this.isFollowed = state.isFollowed;
    this.isLiked = state.isLiked;
    this.likesCount = state.likesCount;
  }

  public handleLikeDislike(slug: string): void {
    if (!this.isAuthorized)
      return this.redirectionService.redirectUnauthorized();

    this.articlePageButtonsService.updateState('favoriteInProgress', true);

    if (this.isLiked) return this.likeHandler(slug, 'removeFromFavorites');
    if (!this.isLiked) return this.likeHandler(slug, 'addToFavorites');
  }

  public handleFollowUnfollow(username: string): void {
    if (!this.isAuthorized)
      return this.redirectionService.redirectUnauthorized();

    this.articlePageButtonsService.updateState('followingInProgress', true);

    if (this.isFollowed) return this.followingHandler(username, 'unfollow');
    if (!this.isFollowed) return this.followingHandler(username, 'follow');
  }

  private likeHandler(
    slug: string,
    method: 'addToFavorites' | 'removeFromFavorites'
  ): void {
    this.articlesService[method](slug)
      .pipe(takeUntil(this.notifier))
      .subscribe((article) => {
        if (!(article instanceof HttpErrorResponse)) {
          this.articlePageButtonsService.updateState(
            'isLiked',
            article.favorited
          );
          this.articlePageButtonsService.updateState(
            'likesCount',
            article.favoritesCount
          );
          this.articlePageButtonsService.updateState(
            'favoriteInProgress',
            false
          );
        }
      });
  }

  private followingHandler(
    username: string,
    method: 'follow' | 'unfollow'
  ): void {
    this.profilesService[method](username)
      .pipe(takeUntil(this.notifier))
      .subscribe((profile) => {
        if (!(profile instanceof HttpErrorResponse)) {
          this.articlePageButtonsService.updateState(
            'isFollowed',
            profile.following
          );
          this.articlePageButtonsService.updateState(
            'followingInProgress',
            false
          );
        }
      });
  }

  public deleteArticle(slug: string): void {
    this.articlesService
      .deleteArticle(slug)
      .pipe(takeUntil(this.notifier))
      .subscribe(() => this.redirectionService.redirectHome());
  }

  public redirectToEditArticle(slug: string): void {
    this.redirectionService.redirectToEditArticle(slug);
  }
}

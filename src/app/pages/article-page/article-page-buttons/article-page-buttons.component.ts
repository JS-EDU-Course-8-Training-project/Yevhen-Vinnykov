import { Subject, takeUntil } from 'rxjs';
import {
  ArticlePageButtonsService,
  IButtonsState,
} from '../services/buttons/article-page-buttons.service';
import { IArticle } from 'src/app/shared/models/IArticle';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { ProfilesService } from 'src/app/shared/services/profiles/profiles.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
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
  private isAuth!: boolean;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService,
    private profilesService: ProfilesService,
    private buttonsService: ArticlePageButtonsService,
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
    this.isAuth = !!this.authUser.token;
    this.username = this.article?.author?.username;
    this.isAuthor = this.article?.author?.username === this.authUser?.username;

    if (!this.isAuthor && this.article) {
      this.buttonsService
        .initialize(this.article)
        .pipe(takeUntil(this.notifier))
        .subscribe((state) => this.setDataOnResponse(state));
    }
  }

  private setDataOnResponse(state: IButtonsState) {
    this.followingInProgress = state.followingInProgress;
    this.favoriteInProgress = state.favoriteInProgress;
    this.isFollowed = state.isFollowed;
    this.isLiked = state.isLiked;
    this.likesCount = state.likesCount;
  }

  public async like(slug: string): Promise<void> {
    if (!this.isAuth) return this.redirectionService.redirectUnauthorized();

    this.buttonsService.updateState('favoriteInProgress', true);

    const { favorited, favoritesCount } =
      await this.articlesService.addToFavorites(slug);
    this.buttonsService.updateState('isLiked', favorited);
    this.buttonsService.updateState('likesCount', favoritesCount);

    this.buttonsService.updateState('favoriteInProgress', false);
  }

  public async dislike(slug: string): Promise<void> {
    if (!this.isAuth) return this.redirectionService.redirectUnauthorized();

    this.buttonsService.updateState('favoriteInProgress', true);

    const { favorited, favoritesCount } =
      await this.articlesService.removeFromFavorites(slug);
    this.buttonsService.updateState('isLiked', favorited);
    this.buttonsService.updateState('likesCount', favoritesCount);

    this.buttonsService.updateState('favoriteInProgress', false);
  }

  public async follow(username: string): Promise<void> {
    if (!this.isAuth) return this.redirectionService.redirectUnauthorized();

    this.buttonsService.updateState('followingInProgress', true);

    const { following } = await this.profilesService.follow(username);
    this.buttonsService.updateState('isFollowed', following);

    this.buttonsService.updateState('followingInProgress', false);
  }

  public async unfollow(username: string): Promise<void> {
    if (!this.isAuth) return this.redirectionService.redirectUnauthorized();

    this.buttonsService.updateState('followingInProgress', true);

    const { following } = await this.profilesService.unfollow(username);
    this.buttonsService.updateState('isFollowed', following);

    this.buttonsService.updateState('followingInProgress', false);
  }

  public async deleteArticle(slug: string): Promise<void> {
    try {
      await this.articlesService.deleteArticle(slug);
      this.redirectionService.redirectHome();
    } catch (error) {
      console.log(error);
    }
  }

  public redirectToEditArticle(slug: string): void {
    this.redirectionService.redirectToEditArticle(slug);
  }
}

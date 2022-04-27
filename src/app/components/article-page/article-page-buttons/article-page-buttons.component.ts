import { Subject, takeUntil } from 'rxjs';
import { ArticlePageButtonsService, IButtonsState } from './article-page-buttons.service';
import { AuthorizationService } from '../../../shared/services/authorization.service';
import { IArticle } from 'src/app/shared/models/IArticle';
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { ProfilesService } from 'src/app/shared/services/profiles.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';

@Component({
  selector: 'app-article-page-buttons',
  templateUrl: './article-page-buttons.component.html',
  styleUrls: ['./article-page-buttons.component.scss']
})
export class ArticlePageButtonsComponent implements OnChanges, OnDestroy {
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
    private router: Router,
    private articlesService: ArticlesService,
    private profilesService: ProfilesService,
    private authorizationService: AuthorizationService,
    private articlePageButtonsService: ArticlePageButtonsService
  ) { }

  ngOnChanges(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private initialize(): void {
    const initialState: IButtonsState = {
      followingInProgress: false,
      favoriteInProgress: false,
      isLiked: this.article?.favorited,
      isFollowed: this.article?.author?.following, 
      likesCount: this.article?.favoritesCount
    };
    this.articlePageButtonsService.initialize(initialState)
    .pipe(takeUntil(this.notifier))
    .subscribe(state => {
      this.followingInProgress = state.followingInProgress;
      this.favoriteInProgress = state.favoriteInProgress;
      this.isFollowed = state.isFollowed;
      this.isLiked = state.isLiked;
      this.likesCount = state.likesCount;
    });
    this.username = this.article?.author?.username;
    this.isAuthor = this.article?.author?.username === this.authUser?.username;
    this.authorizationService.isAuthorized$
      .pipe(takeUntil(this.notifier))
      .subscribe((isAuthorized) => this.isAuthorized = isAuthorized);
    
  }

  public handleLikeDislike(slug: string): void {
    if ((!this.isAuthorized)) return this.redirectUnauthorized();
    this.articlePageButtonsService.setFavoriteInProgress(true);
    if (this.isLiked) return this.likeHandler(slug, 'removeFromFavorites');
    if (!this.isLiked) return this.likeHandler(slug, 'addToFavorites');
  }

  public handleFollowUnfollow(username: string): void {
    if ((!this.isAuthorized)) return this.redirectUnauthorized();
    this.articlePageButtonsService.setFollowingInProgress(true);
    if (this.isFollowed) return this.followingHandler(username, 'unfollow');
    if (!this.isFollowed) return this.followingHandler(username, 'follow');
  }

  private likeHandler(slug: string, method: 'addToFavorites' | 'removeFromFavorites'): void {
    this.articlesService[method](slug)
      .pipe(takeUntil(this.notifier))
      .subscribe(article => {
        this.articlePageButtonsService.setIsLiked(article.favorited);
        this.articlePageButtonsService.setLikesCount(article.favoritesCount);
        this.articlePageButtonsService.setFavoriteInProgress(false);
      })
  }

  private followingHandler(username: string, method: 'follow' | 'unfollow'): void {
    this.profilesService[method](username)
      .pipe(takeUntil(this.notifier))
      .subscribe((profile => {
        this.articlePageButtonsService.setIsFollowed(profile.following);
        this.articlePageButtonsService.setFollowingInProgress(false);
      }));
  }

  public deleteArticle(slug: string): void {
    this.articlesService.deleteArticle(slug)
      .pipe(takeUntil(this.notifier))
      .subscribe(() => {
        this.router.navigateByUrl('/').catch(err => console.log(err));
      });
  }

  public redirectToEditArticle(slug: string): void {
    this.router.navigateByUrl(`/edit-article/${slug}`).catch(err => console.log(err));
  }

  private redirectUnauthorized(): void {
    this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
  }
}

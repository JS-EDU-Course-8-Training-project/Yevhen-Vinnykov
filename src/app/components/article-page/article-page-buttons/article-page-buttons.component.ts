import { ArticlePageButtonsService } from './article-page-buttons.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { IArticle } from 'src/app/models/IArticle';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ArticlesService } from 'src/app/services/articles.service';
import { ProfilesService } from 'src/app/services/profiles.service';
import { IExistingUser } from 'src/app/models/IExistingUser';

@Component({
  selector: 'app-article-page-buttons',
  templateUrl: './article-page-buttons.component.html',
  styleUrls: ['./article-page-buttons.component.scss']
})
export class ArticlePageButtonsComponent implements OnInit, OnChanges{
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

  constructor(
    private router: Router,
    private articlesService: ArticlesService,
    private profilesService: ProfilesService,
    private authorizationService: AuthorizationService,
    private articlePageButtonsService: ArticlePageButtonsService
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  ngOnChanges(): void {
    this.isAuthor = this.article?.author?.username === this.authUser?.username;
  }

  private initialize(): void {
    // REALLY DOUBT THIS IS THE WAY IT SHOULD BE. REFACTORING NEEDED
    this.articlePageButtonsService
      .initialize(this.article?.favorited, this.article?.author?.following, this.article?.favoritesCount);
    this.articlePageButtonsService.isLiked$.subscribe(isLiked => this.isLiked = isLiked);
    this.articlePageButtonsService.isFollowed$.subscribe(isFollowed => this.isFollowed = isFollowed);
    this.articlePageButtonsService.likesCount$.subscribe(likesCount => this.likesCount = likesCount);
    this.articlePageButtonsService.favoriteInProgress$.subscribe(value => this.favoriteInProgress = value);
    this.articlePageButtonsService.followingInProgress$.subscribe(value => this.followingInProgress = value);
    this.username = this.article?.author?.username;
    this.isAuthor = this.article?.author?.username === this.authUser?.username;
    this.authorizationService.isAuthorized$.subscribe((isAuthorized) => this.isAuthorized = isAuthorized);
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
    this.articlesService[method](slug).subscribe(article => {
      this.articlePageButtonsService.setIsLiked(article.favorited);
      this.articlePageButtonsService.setLikesCount(article.favoritesCount);
      this.articlePageButtonsService.setFavoriteInProgress(false);
    })
  }

  private followingHandler(username: string, method: 'follow' | 'unfollow'): void {
    this.profilesService[method](username).subscribe((profile => {
      this.articlePageButtonsService.setIsFollowed(profile.following);
      this.articlePageButtonsService.setFollowingInProgress(false);
    }));
  }

  public deleteArticle(slug: string): void {
    this.articlesService.deleteArticle(slug).subscribe(() => {
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

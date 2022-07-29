import { IArticle, IArticleResponse } from 'src/app/shared/models/IArticle';
import { IProfile } from '../../shared/models/IProfile';
import { ProfilesService } from 'src/app/shared/services/profiles/profiles.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { ArticlesStore } from 'src/app/shared/services/articles/articles.store';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  providers: [ArticlesStore],
})
export class UserPageComponent
  extends TestedComponent
  implements OnInit, OnDestroy
{
  public user!: IExistingUser | IProfile;
  public isMyself!: boolean;
  public isFollowed!: boolean;

  public tabIndex = 0;
  public isLoading!: boolean;
  public currentPage = 0;
  public pagesTotalCount = 0;
  private offset = 0;
  private limit = 5;
  public error!: string;

  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private profilesService: ProfilesService,
    private router: Router,
    private authService: AuthorizationService,
    public store: ArticlesStore,
    private articlesService: ArticlesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.init();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.notifier)
      )
      .subscribe(() => this.init());
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private init(): void {
    this.setUserData();
    this.loadArticles();
  }

  private async setUserData(): Promise<void> {
    const authUser = this.authService.authUser$.getValue();
    const urlUsername = this.router.url.split('/')[2].replace('%20', ' ');

    this.isMyself = authUser.username === urlUsername;
    this.user = this.isMyself
      ? authUser
      : await this.profilesService.fetchUser(urlUsername);
    this.isFollowed = !this.isMyself && (this.user as IProfile).following;
  }

  public async loadArticles(): Promise<void> {
    this.isLoading = true;
    try {
      const { articles, articlesCount } =
        this.tabIndex === 0
          ? await this.getMyArticles()
          : await this.getFavoritedArticles();
      this.onResponse(articles, articlesCount);
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private async getMyArticles(): Promise<IArticleResponse> {
    return await this.articlesService.fetchUserArticles(
      this.user.username,
      this.offset,
      this.limit
    );
  }

  private async getFavoritedArticles(): Promise<IArticleResponse> {
    return await this.articlesService.fetchFavoritedArticles(
      this.user.username,
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

  public handleTabChange(index: number): void {
    this.tabIndex = index;
    this.reset();
    this.loadArticles();
  }

  private reset(): void {
    this.store.articles$.next([]);

    this.offset = 0;
    this.currentPage = 0;
    this.pagesTotalCount = 0;
  }
}

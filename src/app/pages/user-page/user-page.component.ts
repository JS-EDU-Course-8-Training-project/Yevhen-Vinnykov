import { IProfile } from '../../shared/models/IProfile';
import { ProfilesService } from 'src/app/shared/services/profiles/profiles.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
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
  public followingInProgress!: boolean;
  public isFollowed!: boolean;
  public tabIndex = 0;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private profilesService: ProfilesService,
    private router: Router,
    private authService: AuthorizationService,
    public store: ArticlesStore
  ) {
    super();
  }

  ngOnInit(): void {
    this.setUserData();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.notifier)
      )
      .subscribe(() => this.setUserData());
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private initStore() {
    if (this.tabIndex === 0) {
      this.store.useForArticles({ createdBy: this.user.username });
    }
    if (this.tabIndex === 1) {
      this.store.useForArticles({ favoritedBy: this.user.username });
    }

    this.store.getArticles();
  }

  private async setUserData(): Promise<void> {
    const authUser = this.authService.authUser$.getValue();
    const urlUsername = this.router.url.split('/')[2].replace('%20', ' ');
    this.isMyself = authUser.username === urlUsername;

    this.user = this.isMyself
      ? authUser
      : await this.profilesService.fetchUser(urlUsername);
    this.isFollowed = !this.isMyself && (this.user as IProfile).following;

    this.initStore();
  }

  // public async follow(username: string): Promise<void> {
  //   this.followingInProgress = true;

  //   const { following } = await this.profilesService.follow(username);
  //   this.isFollowed = following;

  //   this.followingInProgress = false;
  // }

  // public async unfollow(username: string): Promise<void> {
  //   this.followingInProgress = true;

  //   const { following } = await this.profilesService.unfollow(username);
  //   this.isFollowed = following;

  //   this.followingInProgress = false;
  // }

  public handleTabChange(index: number): void {
    this.tabIndex = index;
    this.initStore();
  }
}

import { IProfile } from '../../shared/models/IProfile';
import { ProfilesService } from 'src/app/shared/services/profiles/profiles.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent
  extends TestedComponent
  implements OnInit, OnDestroy
{
  public user!: IExistingUser | IProfile;
  public tabIndex = 0;
  public urlUsername!: string;
  public isMyself!: boolean;
  public followingInProgress!: boolean;
  public isFollowed!: boolean;
  private isAuthorized!: boolean;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private profilesService: ProfilesService,
    private router: Router,
    private authService: AuthorizationService,
    private redirectionService: RedirectionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setUserData();

    this.authService.isAuthorized$
      .pipe(takeUntil(this.notifier))
      .subscribe((isAuthorized) => (this.isAuthorized = isAuthorized));

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

  private setUserData(): void {
    this.urlUsername = this.router.url.split('/')[2];

    this.authService.authUser$
      .pipe(takeUntil(this.notifier))
      .subscribe((authUser) => {
        this.tabIndex = 0;
        this.isMyself = authUser.username === this.urlUsername;

        if (this.isMyself) {
          this.user = this.authService.authUser$.getValue();
          return;
        }

        this.profilesService
          .fetchUser(this.urlUsername)
          .pipe(takeUntil(this.notifier))
          .subscribe((profile: IProfile) => {
            this.user = profile;
            this.isFollowed = profile.following;
          });
      });
  }

  public handleFollowUnfollow(username: string): void {
    if (!this.isAuthorized) return this.redirectUnauthorized();

    this.followingInProgress = true;

    if (this.isFollowed) return this.followingHandler(username, 'unfollow');
    if (!this.isFollowed) return this.followingHandler(username, 'follow');
  }

  private followingHandler(
    username: string,
    method: 'follow' | 'unfollow'
  ): void {
    this.profilesService[method](username).subscribe((profile: IProfile) => {
      this.isFollowed = profile.following;
      this.followingInProgress = false;
    });
  }

  private redirectUnauthorized(): void {
    this.redirectionService.redirectUnauthorized();
  }
}

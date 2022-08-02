import { filter, takeUntil, Subject } from 'rxjs';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProfile } from 'src/app/shared/models/IProfile';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProfilesService } from 'src/app/shared/services/profiles/profiles.service';

@Component({
  selector: 'app-user-page-banner',
  templateUrl: './user-page-banner.component.html',
  styleUrls: ['./user-page-banner.component.scss'],
})
export class UserPageBannerComponent
  extends TestedComponent
  implements OnInit, OnDestroy
{
  public user!: IProfile | IExistingUser;
  public isMyself!: boolean;
  public isFollowed!: boolean;

  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute,
    private profilesService: ProfilesService
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

  private async setUserData(): Promise<void> {
    const authUser = this.authService.authUser$.getValue();
    const urlUsername = this.route.snapshot.params['user-name'];

    this.isMyself = authUser.username === urlUsername;
    this.user = this.isMyself
      ? authUser
      : await this.profilesService.fetchUser(urlUsername);
    this.isFollowed = !this.isMyself && (this.user as IProfile).following;
  }
}

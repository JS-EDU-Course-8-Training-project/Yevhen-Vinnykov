import { IProfile } from './../../models/IProfile';
import { ProfilesService } from 'src/app/services/profiles.service';
import { IExistingUser } from 'src/app/models/IExistingUser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription, Subject, takeUntil } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})

export class UserPageComponent implements OnInit, OnDestroy {
  public user!: IExistingUser | IProfile;
  public tabIndex: number = 0;
  public urlUsername!: string;
  public isMyself!: boolean;
  public followingInProgress!: boolean;
  public isFollowed!: boolean;
  private isAuthorized!: boolean;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private router: Router,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.setUserData();
    this.authorizationService.isAuthorized$
      .pipe(takeUntil(this.notifier))
      .subscribe((isAuthorized => this.isAuthorized = isAuthorized));
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.notifier))
      .subscribe(() => this.setUserData());
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private setUserData(): void {
    this.urlUsername = this.router.url.split('/')[2];
    this.isMyself = this.usersService.authUser$.getValue().username === this.urlUsername;
    this.tabIndex = 0;
    // if (this.isMyself) {
    //   this.authUserSubscription = this.usersService.authUser$.subscribe(authUser => this.user = authUser);
    // } else {
    this.profilesService.fetchUser(this.urlUsername).subscribe(user => this.user = user);
    // }
    // HAVE TO CHANGE THE LOGIC OF STORING THE LOGGED IN USER'S DATA
    // BEACAUSE THIS WAY IT'S NOT SYNCHRONIZED
  }

  public handleFollowUnfollow(username: string): void {
    if (!this.isAuthorized) return this.redirectUnauthorized();
    this.followingInProgress = true;
    if (this.isFollowed) return this.followingHandler(username, 'unfollow');
    if (!this.isFollowed) return this.followingHandler(username, 'follow');
  }

  private followingHandler(username: string, method: 'follow' | 'unfollow'): void {
    this.profilesService[method](username).subscribe((profile => {
      this.isFollowed = profile.following;
      this.followingInProgress = false;
    }));
  }

  private redirectUnauthorized(): void {
    this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
  }
}




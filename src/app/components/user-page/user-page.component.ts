import { IProfile } from './../../models/IProfile';
import { ProfilesService } from 'src/app/services/profiles.service';
import { IExistingUser } from 'src/app/models/IExistingUser';
import { Component, OnInit, DoCheck } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})

export class UserPageComponent implements OnInit, DoCheck {
  user!: IExistingUser | IProfile;
  tabIndex: number = 0;
  urlUsername!: string;
  isMyself!: boolean;
  followingInProgress!: boolean;
  isFollowed!: boolean;
  constructor(
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private router: Router,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    //  this.urlUsername = this.router.events//.url.split('/')[2];
    this.urlUsername = this.router.url.split('/')[2];

    forkJoin({
      authUser: this.usersService.fetchAuthUser(),
      user: this.profilesService.fetchUser(this.urlUsername)
    }).subscribe(({ authUser, user }) => {
      this.isMyself = authUser.username === this.urlUsername;
      this.user = this.isMyself ? authUser : user;
      this.isFollowed = user.following;
    })
  }

  ngDoCheck(): void {
    this.urlUsername = this.router.url.split('/')[2];
  }

  handleFollowUnfollow(username: string): void {
    this.authorizationService.isAuthorized$.subscribe(isAuthorized => {
      if (!isAuthorized) this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
    })
    this.followingInProgress = true;
    if (this.isFollowed) {
      this.isFollowed = true;
      this.profilesService.unfollow(username).subscribe((profile => {
        this.isFollowed = profile.following;
        this.followingInProgress = false;
      }));
    } else {
      this.profilesService.follow(username).subscribe(profile => {
        this.isFollowed = profile.following;
        this.followingInProgress = false;
      });
    }
  }
}

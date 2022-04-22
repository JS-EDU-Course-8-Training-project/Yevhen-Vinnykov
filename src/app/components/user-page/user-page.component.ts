import { ProfilesService } from 'src/app/services/profiles.service';
import { IExistingUser } from 'src/app/models/IExistingUser';
import { Component, OnInit, DoCheck } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';


interface IUser extends IExistingUser {
  following: boolean;
}

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})

export class UserPageComponent implements OnInit, DoCheck {
  user!: IUser;
  tabIndex: number = 0;
  urlUsername!: string;
  isMyself!: boolean;
  followingInProgress!: boolean;
  isFollowed!: boolean;
  constructor(
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
    if (localStorage.getItem('authorized') !== 'true') {
      this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
      return;
    }
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

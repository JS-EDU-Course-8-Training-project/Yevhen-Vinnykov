import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { Component, Input } from '@angular/core';
import { IProfile } from 'src/app/shared/models/IProfile';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { ProfilesService } from 'src/app/shared/services/profiles/profiles.service';

@Component({
  selector: 'app-user-page-banner',
  templateUrl: './user-page-banner.component.html',
  styleUrls: ['./user-page-banner.component.scss'],
})
export class UserPageBannerComponent extends TestedComponent {
  @Input() followingInProgress!: boolean;
  @Input() isMyself!: boolean;
  @Input() user!: IProfile | IExistingUser;
  @Input() isFollowed!: boolean;

  constructor(private profilesService: ProfilesService) {
    super();
  }

  public async follow(username: string): Promise<void> {
    this.followingInProgress = true;

    const { following } = await this.profilesService.follow(username);
    this.isFollowed = following;

    this.followingInProgress = false;
  }

  public async unfollow(username: string): Promise<void> {
    this.followingInProgress = true;

    const { following } = await this.profilesService.unfollow(username);
    this.isFollowed = following;

    this.followingInProgress = false;
  }
}

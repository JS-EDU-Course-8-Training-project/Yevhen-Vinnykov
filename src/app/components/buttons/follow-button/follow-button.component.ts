import { Component, OnInit, Input } from '@angular/core';
import { ProfilesService } from 'src/app/shared/services/profiles/profiles.service';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { FollowButtonStore } from './follow-button.store';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss', '../buttons.scss'],
})
export class FollowButtonComponent implements OnInit {
  @Input() isAuth!: boolean;
  @Input() isFollowed!: boolean;
  @Input() username!: string;

  constructor(
    public store: FollowButtonStore,
    private redirectionService: RedirectionService,
    private profilesService: ProfilesService
  ) {}

  ngOnInit(): void {
    this.store.isFollowed$.next(this.isFollowed);
  }

  public async follow(): Promise<void> {
    if (!this.isAuth) return this.redirectionService.redirectUnauthorized();

    this.store.isLoading$.next(true);

    const { following } = await this.profilesService.follow(this.username);
    this.store.isFollowed$.next(following);

    this.store.isLoading$.next(false);
  }

  public async unfollow(): Promise<void> {
    if (!this.isAuth) return this.redirectionService.redirectUnauthorized();

    this.store.isLoading$.next(true);

    const { following } = await this.profilesService.unfollow(this.username);
    this.store.isFollowed$.next(following);

    this.store.isLoading$.next(false);
  }
}

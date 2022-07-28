import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { Component, Input } from '@angular/core';
import { IProfile } from 'src/app/shared/models/IProfile';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-user-page-banner',
  templateUrl: './user-page-banner.component.html',
  styleUrls: ['./user-page-banner.component.scss'],
})
export class UserPageBannerComponent extends TestedComponent {
  @Input() isMyself!: boolean;
  @Input() user!: IProfile | IExistingUser;
  @Input() isFollowed!: boolean;

  constructor() {
    super();
  }
}

import { Subject, takeUntil } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IExistingUser } from 'src/app/models/IExistingUser';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit, OnDestroy {
  public authUser!: IExistingUser;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.usersService.authUser$.pipe(takeUntil(this.notifier))
      .subscribe(authUser => this.authUser = authUser);
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

}

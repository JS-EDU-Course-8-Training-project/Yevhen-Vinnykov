import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { ISavedData } from 'src/app/shared/models/ISavedData';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit, OnDestroy, ISavedData {
  public isModified$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public authUser!: IExistingUser;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.usersService.authUser$
      .pipe(takeUntil(this.notifier))
      .subscribe(authUser => this.authUser = authUser);
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public isDataSaved(): boolean {
    return !this.isModified$.getValue();
  }
}

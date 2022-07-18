import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { ISavedData } from 'src/app/shared/models/ISavedData';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit, OnDestroy, ISavedData {
  public isModified$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public authUser!: IExistingUser;
  private notifier: Subject<void> = new Subject<void>();

  constructor(private authService: AuthorizationService) {}

  ngOnInit(): void {
    this.authService.authUser$
      .pipe(takeUntil(this.notifier))
      .subscribe((authUser) => (this.authUser = authUser));
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public isDataSaved(): boolean {
    return !this.isModified$.getValue();
  }
}

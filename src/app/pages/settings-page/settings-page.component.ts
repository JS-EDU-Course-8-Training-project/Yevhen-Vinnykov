import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { ISavedData } from 'src/app/shared/models/ISavedData';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit, ISavedData {
  public isModified$ = new BehaviorSubject<boolean>(false);
  public authUser!: IExistingUser;

  constructor(private authService: AuthorizationService) {}

  ngOnInit(): void {
    this.authUser = this.authService.authUser$.getValue();
  }

  public isDataSaved(): boolean {
    return !this.isModified$.getValue();
  }
}

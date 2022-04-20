import { UsersService } from 'src/app/services/users.service';
import { Component, OnInit } from '@angular/core';
import { IExistingUser } from 'src/app/models/IExistingUser';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  public authUser!: IExistingUser;
  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.usersService.fetchAuthUser().subscribe(user => {
      this.authUser = user;
      console.log(this.authUser);
    });
  }
}

import { IExistingUser } from 'src/app/models/IExistingUser';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  authUser!: IExistingUser;
  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.usersService.fetchAuthUser().subscribe(user => this.authUser = user);
  }

}

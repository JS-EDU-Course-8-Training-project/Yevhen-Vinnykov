import { Component, OnInit } from '@angular/core';
import { IExistingUser } from 'src/app/models/IExistingUser';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss']
})
export class NavbarUserComponent implements OnInit {
  authUser!: IExistingUser;
  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.usersService.fetchAuthUser().subscribe(user => this.authUser = user);
  }

}

import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IExistingUser } from 'src/app/models/IExistingUser';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss']
})
export class NavbarUserComponent implements OnInit {
  @Input() url$!: BehaviorSubject<string>;
  authUser!: IExistingUser;
  className!: string;

  constructor(
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.usersService.fetchAuthUser().subscribe(user => this.authUser = user);
    this.url$.subscribe(path => {
      this.className = path === `/user/${this.authUser?.username}` ? 'selected' : '';
    });
  }
}

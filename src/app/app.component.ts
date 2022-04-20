import { Component } from '@angular/core';
import { IExistingUser } from './models/IExistingUser';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  authUser!: IExistingUser;
  constructor(private usersService: UsersService) {}
  ngOnInit(){
    this.usersService.fetchAuthUser().subscribe(user => this.authUser = user);
  }
}

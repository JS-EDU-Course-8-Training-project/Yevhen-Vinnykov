import { Component } from '@angular/core';
import { AuthorizationService } from './services/authorization.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private authorizationService: AuthorizationService,
    private usersService: UsersService,
  ) { }
  
  ngOnInit() {
    this.initializeApp();
  }

  private initializeApp(): void {
    this.authorizationService.isAuthorized$.subscribe(isAuthorized => {
      if (isAuthorized) {
        this.usersService.fetchAuthUser();
      }
    })
  }
}

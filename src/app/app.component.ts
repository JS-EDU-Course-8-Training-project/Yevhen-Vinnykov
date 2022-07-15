import { take } from 'rxjs';
import { Component } from '@angular/core';
import { AuthorizationService } from './shared/services/authorization/authorization.service';
import { UsersService } from './shared/services/users/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private usersService: UsersService,
    private authorizationService: AuthorizationService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  private initialize(): void {
    this.authorizationService.checkIfAuthorized();
    this.authorizationService.isAuthorized$
      .pipe(take(1))
      .subscribe((isAuthorized) => {
        if (isAuthorized && !this.usersService.authUser$.getValue().username) {
          this.usersService.fetchAuthUser().pipe(take(1)).subscribe();
        }
      });
  }
}

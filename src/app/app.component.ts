import { first } from 'rxjs';
import { Component } from '@angular/core';
import { AuthorizationService } from './shared/services/authorization/authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthorizationService) {}

  ngOnInit() {
    this.initialize();
  }

  private initialize(): void {
    this.authService.checkIfAuthorized();

    const isAuth = this.authService.isAuthorized$.getValue();
    const { username } = this.authService.authUser$.getValue();

    if (isAuth && !username)
      this.authService.fetchAuthUser().pipe(first()).subscribe();
  }
}

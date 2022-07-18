import { take } from 'rxjs';
import { Component } from '@angular/core';
import { AuthorizationService } from './shared/services/authorization/authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthorizationService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  private initialize(): void {
    this.authService.checkIfAuthorized();

    this.authService.isAuthorized$
      .pipe(take(1))
      .subscribe((isAuthorized) => {
        if (
          isAuthorized &&
          !this.authService.authUser$.getValue().username
        ) {
          this.authService.fetchAuthUser().pipe(take(1)).subscribe();
        }
      });
  }
}

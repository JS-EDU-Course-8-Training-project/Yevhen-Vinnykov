import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { BehaviorSubject, Subject, takeUntil, filter } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent extends TestedComponent implements OnInit {
  public isAuthorized$: BehaviorSubject<boolean> =
    this.authService.isAuthorized$;
  public url$: BehaviorSubject<string> = new BehaviorSubject<string>('/');
  private notifier: Subject<void> = new Subject<void>();
  public isMenuOpen = false;

  constructor(
    private authService: AuthorizationService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.notifier)
      )
      .subscribe(() => this.url$.next(this.router.url));
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}

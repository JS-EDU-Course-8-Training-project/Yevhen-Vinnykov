import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { BehaviorSubject, Subject, takeUntil, filter } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  public authUser!: IExistingUser;
  public isMenuOpen = false;

  @ViewChild('burger') burger!: ElementRef;

  constructor(
    private authService: AuthorizationService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    const isMobile = window.screen.width < 768;
    if (isMobile) {
      window.addEventListener('click', this.clickListener.bind(this));
    }

    this.authService.authUser$
      .pipe(takeUntil(this.notifier))
      .subscribe((user) => (this.authUser = user));

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
    window.removeEventListener('click', this.clickListener.bind(this));
  }

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  private clickListener(e: Event): void {
    const isClickOutsideBurger =
      e.target !== this.burger.nativeElement.children[0];
    if (isClickOutsideBurger) {
      this.isMenuOpen = false;
    }
  }
}

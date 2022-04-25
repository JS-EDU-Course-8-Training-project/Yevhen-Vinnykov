import { AuthorizationService } from 'src/app/services/authorization.service';
import { BehaviorSubject, pipe, take } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuthorized$: BehaviorSubject<boolean> = this.authorizationService.isAuthorized$;
  url$: BehaviorSubject<string> = new BehaviorSubject<string>('/');
  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authorizationService.checkIfAuthorized();
    this.router.events.subscribe(() => this.url$.next(this.router.url));
  }
}

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BehaviorSubject, pipe, take } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuthorized$: BehaviorSubject<boolean> = this.authorizationService.isAuthorized$;
  constructor(
    private authorizationService: AuthorizationService,
  ) { }

  ngOnInit(): void {
    this.authorizationService.checkIfAuthorized();
  }
}

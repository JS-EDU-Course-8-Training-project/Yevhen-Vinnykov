import { AuthorizationService } from 'src/app/services/authorization.service';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { IExistingUser } from 'src/app/models/IExistingUser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuthorized$: BehaviorSubject<boolean> = this.authorizationService.isAuthorized$;
  @Input() authUser!: IExistingUser;
  constructor(
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.authorizationService.checkIfAuthorized();
  }
}

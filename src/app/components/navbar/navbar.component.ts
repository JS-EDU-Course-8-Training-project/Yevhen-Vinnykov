import { Component, OnInit, ChangeDetectorRef, AfterContentChecked, Input } from '@angular/core';
import { IExistingUser } from 'src/app/models/IExistingUser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterContentChecked {
  isAuthorized: boolean = false;
  @Input() authUser!: IExistingUser;
  constructor(private ref: ChangeDetectorRef) { }

  private checkIfAuth(): void {
    if (localStorage.getItem('authorized') === 'true') {
      this.isAuthorized = true;
      this.ref.markForCheck();
    } else {
      this.isAuthorized = false;
      this.ref.markForCheck();
    }
  }

  ngOnInit(): void {
    this.checkIfAuth();
  }

  ngAfterContentChecked(): void {
    this.checkIfAuth();
  }
}

import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewChecked {
  isAuthorized: boolean = false;
  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
   if(localStorage.getItem('authorized') === 'true') {
    this.isAuthorized = true;
    this.ref.markForCheck();
   }
  }

  ngAfterViewChecked(): void {
      
    if(localStorage.getItem('authorized') === 'true') {
      this.isAuthorized = true;
      this.ref.markForCheck();
  }
}

}

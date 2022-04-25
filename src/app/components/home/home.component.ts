import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading: boolean = false;
  tabIndex: number = 0;
  isAuthorized: boolean = false;
  selectedTag!: string | null;
  constructor(
    private authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.authorizationService.isAuthorized$.subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }

  handleSelectTag(tag: any) {
    this.selectedTag = tag;  
    this.tabIndex = 2;  
  }

  handleChange(index: number): void {
    this.tabIndex = index;
    if (index !== 2) {
      this.selectedTag = null;
    }
  }
}

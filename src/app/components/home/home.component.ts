import { Component, OnInit } from '@angular/core';

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
  constructor() {}

  ngOnInit(): void {
    if (localStorage.getItem('authorized') === 'true') {
      this.isAuthorized = true;
    }
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

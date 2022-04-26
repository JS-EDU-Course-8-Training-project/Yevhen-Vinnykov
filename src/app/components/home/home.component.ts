import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  public tabIndex: number = 0;
  public isAuthorized: boolean = false;
  public selectedTag!: string | null;
  private authSubscription!: Subscription;

  constructor(
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.authorizationService.isAuthorized$
      .subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  handleSelectTag(tag: any) {
    this.selectedTag = tag;
    this.tabIndex = 2;
  }

  handleTabChange(index: number): void {
    this.tabIndex = index;
    if (index !== 2) {
      this.selectedTag = null;
    }
  }
}

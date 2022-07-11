import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends TestedComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  public tabIndex: number = 0;
  public isAuthorized: boolean = false;
  public selectedTag!: string | null;
  private authSubscription!: Subscription;

  constructor(
    private authorizationService: AuthorizationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.authSubscription = this.authorizationService.isAuthorized$
      .subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  public handleSelectTag(tag: string) {
    this.selectedTag = tag;
    this.tabIndex = 2;
  }

  public handleTabChange(index: number): void {
    this.tabIndex = index;
    if (index !== 2) {
      this.selectedTag = null;
    }
  }
}

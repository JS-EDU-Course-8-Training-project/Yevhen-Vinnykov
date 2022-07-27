import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { ArticlesStore } from '../../shared/services/articles/articles.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ArticlesStore],
})
export class HomeComponent extends TestedComponent implements OnInit {
  public isAuthorized = this.authService.isAuthorized$.getValue();
  public selectedTag!: string | null;
  public tabIndex = 0;

  constructor(
    private authService: AuthorizationService,
    public store: ArticlesStore
  ) {
    super();
  }

  ngOnInit(): void {
    this.initStore();
  }

  private initStore() {
    if (this.tabIndex === 1 || !this.isAuthorized) {
      this.store.useForArticles({ global: true });
    }
    if (this.tabIndex === 0 && this.isAuthorized) {
      this.store.useForArticles({ followed: true });
    }
    if (this.tabIndex === 2 && this.selectedTag) {
      this.store.useForArticles({ tag: this.selectedTag });
    }
    this.store.getArticles();
  }

  public handleSelectTag(tag: string) {
    this.selectedTag = tag;
    this.tabIndex = 2;
  }

  public handleTabChange(index: number): void {
    this.tabIndex = index;
    this.initStore();
    if (index !== 2) {
      this.selectedTag = null;
    }
  }
}

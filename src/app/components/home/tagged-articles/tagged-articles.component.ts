import { Subscription } from 'rxjs';
import { IArticle } from 'src/app/models/IArticle';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-tagged-articles',
  templateUrl: './tagged-articles.component.html',
  styleUrls: ['./tagged-articles.component.scss']
})
export class TaggedArticlesComponent implements OnChanges, OnDestroy {
  @Input() isAuthorized: boolean = false;
  @Input() selectedTag!: string | null;
  @Input() tabIndex!: number;

  public articlesSelectedByTag: IArticle[] = [];
  public isLoading: boolean = false;
  private articlesSubscription!: Subscription;

  constructor(
    private articlesService: ArticlesService
  ) { }

  ngOnChanges() {
    if (this.tabIndex === 2) {
      this.getFollowedArticles();
    }
  }

  ngOnDestroy(): void {
    this.articlesSubscription.unsubscribe();
  }

  private getFollowedArticles() {
    if (this.selectedTag) {
      this.isLoading = true;
      this.articlesSubscription = this.articlesService
        .fetchArticlesByTag(this.selectedTag)
        .subscribe(res => {
          this.articlesSelectedByTag = res.articles;
          this.isLoading = false;
        });
    }
  }
}

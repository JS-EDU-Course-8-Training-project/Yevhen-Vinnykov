import { Subscription } from 'rxjs';
import { IArticle } from 'src/app/models/IArticle';
import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-global-feed',
  templateUrl: './global-feed.component.html',
  styleUrls: ['./global-feed.component.scss']
})
export class GlobalFeedComponent implements OnChanges, OnDestroy {
  @Input() tabIndex!: number;

  public globalArticles: IArticle[] = [];
  public isLoading: boolean = false;
  private articlesSubscription!: Subscription;

  constructor(
    private articlesService: ArticlesService
  ) { }

  ngOnChanges(): void {
    if (this.tabIndex === 1) {
      this.getArticles();
    }
  }

  ngOnDestroy(): void {
    this.articlesSubscription.unsubscribe();
  }

  private getArticles(): void {
    this.isLoading = true;
    this.articlesSubscription = this.articlesService.fetchArticles().subscribe(res => {
      this.globalArticles = res.articles;
      this.isLoading = false;
    });
  }
}

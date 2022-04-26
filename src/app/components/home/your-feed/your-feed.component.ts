import { Subject, takeUntil } from 'rxjs';
import { IArticle } from 'src/app/models/IArticle';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-your-feed',
  templateUrl: './your-feed.component.html',
  styleUrls: ['./your-feed.component.scss']
})
export class YourFeedComponent implements OnChanges, OnDestroy {
  @Input() tabIndex!: number;

  public followedArticles: IArticle[] = [];
  public isLoading: boolean = false;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService
  ) { }

  ngOnChanges(): void {
    if (this.tabIndex === 0) {
      this.getFollowedArticles();
    }
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private getFollowedArticles() {
    this.isLoading = true;
    this.articlesService.fetchFollowedArticles()
      .pipe(takeUntil(this.notifier))
      .subscribe(res => {
        this.followedArticles = res.articles;
        this.isLoading = false;
      });
  }
}

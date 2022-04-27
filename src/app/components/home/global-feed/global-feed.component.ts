import { Subject, takeUntil } from 'rxjs';
import { IArticle } from 'src/app/shared/models/IArticle';
import { Component, OnChanges, Input, OnDestroy } from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-global-feed',
  templateUrl: './global-feed.component.html',
  styleUrls: ['./global-feed.component.scss']
})
export class GlobalFeedComponent implements OnChanges, OnDestroy {
  @Input() tabIndex!: number;
  @Input() isAuthorized!: boolean;

  public globalArticles: IArticle[] = [];
  public isLoading: boolean = false;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService
  ) { }

  ngOnChanges(): void {
    if (this.tabIndex === 1 || !this.isAuthorized) {
      this.getArticles();
    }
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private getArticles(): void {
    this.isLoading = true;
    this.articlesService.fetchArticles()
      .pipe(takeUntil(this.notifier))
      .subscribe(res => {
        if (!(res instanceof HttpErrorResponse)){
          this.globalArticles = res.articles;
          this.isLoading = false;
        }
      });
  }
}

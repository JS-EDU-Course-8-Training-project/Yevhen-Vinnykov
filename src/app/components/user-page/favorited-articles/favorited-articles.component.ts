import { Subject, takeUntil } from 'rxjs';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { IArticle } from 'src/app/shared/models/IArticle';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-favorited-articles',
  templateUrl: './favorited-articles.component.html',
  styleUrls: ['./favorited-articles.component.scss']
})
export class FavoritedArticlesComponent implements OnChanges, OnDestroy {
  @Input() username!: string;
  @Input() tabIndex!: number;

  public favoritedArticles: IArticle[] = [];
  public isLoading: boolean = false;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService
  ) { }

  ngOnChanges(): void {
    if (this.tabIndex === 1) {
      this.getArticles();
    }
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private getArticles(): void {
    this.isLoading = true;
    this.articlesService.fetchFavoritedArticles(this.username)
      .pipe(takeUntil(this.notifier))
      .subscribe(res => {
        if (!(res instanceof HttpErrorResponse)) {
          this.favoritedArticles = res.articles;
          this.isLoading = false;
        }
      });
  }
}


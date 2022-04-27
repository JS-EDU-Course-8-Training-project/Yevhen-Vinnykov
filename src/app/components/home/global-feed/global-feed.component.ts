import { Subject, takeUntil } from 'rxjs';
import { IArticle, IArticleResponse } from 'src/app/shared/models/IArticle';
import { Component, OnChanges, Input, OnDestroy, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-global-feed',
  templateUrl: './global-feed.component.html',
  styleUrls: ['./global-feed.component.scss']
})
export class GlobalFeedComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChildren('lastItem', { read: ElementRef }) lastItem!: QueryList<ElementRef>;
  @Input() tabIndex!: number;
  @Input() isAuthorized!: boolean;

  public globalArticles: IArticle[] = [];
  public isLoading: boolean = false;
  private notifier: Subject<void> = new Subject<void>();
  public isFinished!: boolean;
  private offset: number = 0;
  private observer!: IntersectionObserver;
  private currentPage: number = 1;
  private pagesTotalCount!: number;
  private limit: number = 5;

  constructor(
    private articlesService: ArticlesService
  ) { }

  ngOnChanges(): void {
    this.reset();
    if (this.tabIndex === 1 || !this.isAuthorized) {
      this.getArticles();
      this.observeIntersection();
    }
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  ngAfterViewInit(): void {
    this.lastItem.changes.subscribe(change => {
      if (change.last) this.observer.observe(change.last.nativeElement);
    });
  }

  private getArticles(): void {
    this.isLoading = true;
    this.articlesService.fetchArticles(this.offset, this.limit)
      .pipe(takeUntil(this.notifier))
      .subscribe((response: IArticleResponse | HttpErrorResponse) => {
        // if (!(res instanceof HttpErrorResponse)){
        const res = response as IArticleResponse;
        this.globalArticles = [...this.globalArticles, ...res.articles];
        this.pagesTotalCount = Math.ceil(res.articlesCount / this.limit);
        this.isFinished = this.currentPage === this.pagesTotalCount;
        this.isLoading = false;
        // }
      });
  }

  private observeIntersection(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!this.isFinished && !this.isLoading) {
          this.offset += this.limit;
          this.getArticles();
          this.currentPage++;
        }
      }
    }, options);
  }

  private reset(): void {
    this.globalArticles = [];
    this.offset = 0;
    this.pagesTotalCount = 0;
    this.isFinished = false;
    this.currentPage = 1;
  }

}

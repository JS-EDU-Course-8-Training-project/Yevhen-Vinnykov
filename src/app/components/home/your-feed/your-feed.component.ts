import { BehaviorSubject, catchError, Observable, Subject, takeUntil } from 'rxjs';
import { IArticle, IArticleResponse } from 'src/app/shared/models/IArticle';
import { Component, Input, OnChanges, OnDestroy, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/infinite-scroll.service';

@Component({
  selector: 'app-your-feed',
  templateUrl: './your-feed.component.html',
  styleUrls: ['./your-feed.component.scss']
})
export class YourFeedComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChildren('lastItem', { read: ElementRef }) lastItem!: QueryList<ElementRef>;
  @Input() tabIndex!: number;

  public followedArticles: IArticle[] = [];
  public isLoading: boolean = false;
  private notifier: Subject<void> = new Subject<void>();
  public isFinished!: boolean;
  private offset: number = 0;
  private pagesTotalCount!: number;
  private limit: number = 5;
  private currentPage: number = 1;
  public canLoad$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private articlesService: ArticlesService,
    private infiniteScroll: InfiniteScrollService
  ) { }

  ngOnChanges(): void {
    this.reset();
    if (this.tabIndex === 0) {
      this.getFollowedArticles();
      this.infiniteScroll
        .observeIntersection({ canLoad: this.canLoad$, callback: this.getFollowedArticles.bind(this) });
    }
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  ngAfterViewInit(): void {
    this.lastItem.changes.subscribe(change => {
      if (change.last) this.infiniteScroll.observer.observe(change.last.nativeElement);
    });
  }

  private getFollowedArticles() {
    this.isLoading = true;
    this.articlesService.fetchFollowedArticles(this.offset, this.limit)
      .pipe(
        takeUntil(this.notifier),
        catchError((err: HttpErrorResponse): any => this.onCatchError(err)))
      .subscribe((response: IArticleResponse | any) => this.setDataOnResponse(response));
  }

  private setDataOnResponse(response: IArticleResponse): void {
    this.followedArticles = [...this.followedArticles, ...response.articles];
    this.pagesTotalCount = Math.ceil(response.articlesCount / this.limit);
    this.isFinished = this.currentPage === this.pagesTotalCount;
    this.isLoading = false;
    this.canLoad$.next(!this.isFinished && !this.isLoading);
    this.nextPage();
  }

  private onCatchError(error: HttpErrorResponse): void {
    console.error(error);
  }

  private nextPage() {
    if (this.currentPage < this.pagesTotalCount) {
      this.currentPage++;
      this.offset += this.limit;
    }
  }

  private reset(): void {
    this.followedArticles = [];
    this.offset = 0;
    this.isFinished = false;
    this.currentPage = 1;
    this.pagesTotalCount = 0;
  }
}

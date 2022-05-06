import { Subject, takeUntil, BehaviorSubject, catchError, Observable } from 'rxjs';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { IArticle, IArticleResponse } from 'src/app/shared/models/IArticle';
import { Component, Input, OnChanges, OnDestroy, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/infinite-scroll.service';

@Component({
  selector: 'app-favorited-articles',
  templateUrl: './favorited-articles.component.html',
  styleUrls: ['./favorited-articles.component.scss']
})
export class FavoritedArticlesComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChildren('lastItem', { read: ElementRef }) lastItem!: QueryList<ElementRef>;

  @Input() username!: string;
  @Input() tabIndex!: number;

  public favoritedArticles: IArticle[] = [];
  public isLoading: boolean = false;
  private notifier: Subject<void> = new Subject<void>();
  public isFinished!: boolean;
  private offset: number = 0;
  private pagesTotalCount!: number;
  private limit: number = 5;
  private currentPage: number = 1;
  public canLoad$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public error: string = '';

  constructor(
    private articlesService: ArticlesService,
    private infiniteScroll: InfiniteScrollService
  ) { }

  ngOnChanges(): void {
    this.reset();
    if (this.tabIndex !== 1) return;
    this.getArticles();
    this.infiniteScroll
      .observeIntersection({ canLoad: this.canLoad$, callback: this.getArticles.bind(this) });
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

  private getArticles(): void {
    this.error = '';
    this.isLoading = true;
    this.articlesService.fetchFavoritedArticles(this.username, this.limit, this.offset)
      .pipe(
        takeUntil(this.notifier),
        catchError((err: HttpErrorResponse): any => this.onCatchError(err)))
      .subscribe((res: IArticleResponse | any) => this.setData(res));
  }

  private setData(response: IArticleResponse): void {
    this.favoritedArticles = [...this.favoritedArticles, ...response.articles];
    this.isLoading = false;
    this.pagesTotalCount = Math.ceil(response.articlesCount / this.limit);
    this.isFinished = this.currentPage === this.pagesTotalCount;
    this.isLoading = false;
    this.canLoad$.next(!this.isFinished && !this.isLoading);
    this.nextPage();
  }

  private onCatchError(error: HttpErrorResponse): void {
    this.error = 'Something went wrong :(';
    this.isLoading = false;
  }

  private nextPage() {
    if (this.currentPage < this.pagesTotalCount) {
      this.currentPage++;
      this.offset += this.limit;
    }
  }

  private reset(): void {
    this.favoritedArticles = [];
    this.offset = 0;
    this.isFinished = false;
    this.currentPage = 1;
    this.pagesTotalCount = 0;
  }
}


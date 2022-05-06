import { Subject, takeUntil, BehaviorSubject, catchError } from 'rxjs';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { IArticle, IArticleResponse } from 'src/app/shared/models/IArticle';
import { Component, Input, OnChanges, OnDestroy, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/infinite-scroll.service';

@Component({
  selector: 'app-my-articles',
  templateUrl: './my-articles.component.html',
  styleUrls: ['./my-articles.component.scss']
})
export class MyArticlesComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChildren('lastItem', { read: ElementRef }) lastItem!: QueryList<ElementRef>;

  @Input() username!: string;
  @Input() tabIndex!: number;

  public myArticles: IArticle[] = [];
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
    if (this.tabIndex !== 0) return;
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
    this.articlesService.fetchUserArticles(this.username, this.limit, this.offset)
      .pipe(
        takeUntil(this.notifier),
        catchError((error: HttpErrorResponse): any => this.onCatchError(error)))
      .subscribe((res: IArticleResponse | any) => this.setData(res));
  }

  private setData(response: IArticleResponse): void {
    this.myArticles = [...this.myArticles, ...response.articles];
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
    this.myArticles = [];
    this.offset = 0;
    this.isFinished = false;
    this.currentPage = 1;
    this.pagesTotalCount = 0;
  }
}

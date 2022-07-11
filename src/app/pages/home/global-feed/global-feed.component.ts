import { BehaviorSubject, catchError, Observable, of, Subject, takeUntil } from 'rxjs';
import { IArticle, IArticleResponse } from 'src/app/shared/models/IArticle';
import {
  Component,
  OnChanges,
  Input,
  OnDestroy,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/infinite-scroll.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-global-feed',
  templateUrl: './global-feed.component.html',
  styleUrls: ['./global-feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalFeedComponent extends TestedComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChildren('lastItem', { read: ElementRef }) lastItem!: QueryList<ElementRef>;
  @Input() tabIndex!: number;
  @Input() isAuthorized!: boolean;

  public globalArticles: IArticle[] = [];
  public isLoading: boolean = false;
  private notifier: Subject<void> = new Subject<void>();
  public isFinished!: boolean;
  private offset: number = 0;
  private currentPage: number = 1;
  private pagesTotalCount!: number;
  private limit: number = 5;
  public canLoad$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public error: string = '';

  constructor(
    private articlesService: ArticlesService,
    private infiniteScroll: InfiniteScrollService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnChanges(): void {
    this.reset();
    if (this.tabIndex === 1 || !this.isAuthorized) {
      this.getArticles();
      this.infiniteScroll
        .observeIntersection({ canLoad: this.canLoad$, callback: this.getArticles.bind(this) });
    }
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  ngAfterViewInit(): void {
    this.lastItem.changes
      .pipe(takeUntil(this.notifier))
      .subscribe(change => {
        if (change.last) this.infiniteScroll.observer.observe(change.last.nativeElement);
      });
  }

  private getArticles(): void {
    this.error = '';
    this.isLoading = true;
    this.cdRef.detectChanges();
    this.articlesService.fetchArticles(this.offset, this.limit)
      .pipe(
        takeUntil(this.notifier),
        catchError((error: HttpErrorResponse): any => this.onCatchError(error)))
      .subscribe((response: IArticleResponse | any) => this.setDataOnResponse(response));
  }

  private setDataOnResponse(response: IArticleResponse): void {
    this.globalArticles = [...this.globalArticles, ...response.articles];
    this.isLoading = false;
    this.pagesTotalCount = Math.ceil(response.articlesCount / this.limit);
    this.isFinished = this.currentPage === this.pagesTotalCount;
    this.canLoad$.next(!this.isFinished && !this.isLoading);
    this.nextPage();
    this.cdRef.detectChanges();
  }

  private onCatchError(error: HttpErrorResponse): Observable<IArticleResponse> {
    this.error = 'Something went wrong :(';
    this.isLoading = false;
    this.cdRef.detectChanges();
    return of({ articles: [], articlesCount: 0 })
  }

  private nextPage(): void {
    if (this.currentPage < this.pagesTotalCount) {
      this.currentPage++;
      this.offset += this.limit;
    }
  }

  private reset(): void {
    this.globalArticles = [];
    this.offset = 0;
    this.pagesTotalCount = 0;
    this.isFinished = false;
    this.currentPage = 1;
    this.cdRef.detectChanges();
  }

}

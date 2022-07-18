import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import {
  BehaviorSubject,
  catchError,
  Subject,
  takeUntil,
  of,
  Observable,
} from 'rxjs';
import { IArticle, IArticleResponse } from 'src/app/shared/models/IArticle';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/infinite-scroll.service';

@Component({
  selector: 'app-your-feed',
  templateUrl: './your-feed.component.html',
  styleUrls: ['./your-feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YourFeedComponent
  extends TestedComponent
  implements OnChanges, OnDestroy, AfterViewInit
{
  @ViewChildren('lastItem', { read: ElementRef })
  lastItem!: QueryList<ElementRef>;
  @Input() tabIndex!: number;

  public followedArticles: IArticle[] = [];
  public isLoading = false;
  private notifier: Subject<void> = new Subject<void>();
  public isFinished!: boolean;
  private offset = 0;
  private pagesTotalCount!: number;
  private limit = 5;
  private currentPage = 1;
  public canLoad$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  public error = '';

  constructor(
    private articlesService: ArticlesService,
    private infiniteScroll: InfiniteScrollService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnChanges(): void {
    this.reset();
    if (this.tabIndex === 0) {
      this.getFollowedArticles();
      this.infiniteScroll.observeIntersection({
        canLoad: this.canLoad$,
        callback: this.getFollowedArticles.bind(this),
      });
    }
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  ngAfterViewInit(): void {
    this.lastItem.changes.subscribe((change) => {
      if (change.last)
        this.infiniteScroll.observer.observe(change.last.nativeElement);
    });
  }

  private getFollowedArticles() {
    this.error = '';
    this.isLoading = true;
    this.cdRef.detectChanges();

    this.articlesService
      .fetchFollowedArticles(this.offset, this.limit)
      .pipe(
        takeUntil(this.notifier),
        catchError((err: string) => this.onCatchError(err))
      )
      .subscribe((response: IArticleResponse) =>
        this.setDataOnResponse(response)
      );
  }

  private setDataOnResponse(response: IArticleResponse): void {
    this.followedArticles = [...this.followedArticles, ...response.articles];
    this.pagesTotalCount = Math.ceil(response.articlesCount / this.limit);
    this.isFinished = this.currentPage === this.pagesTotalCount;
    this.isLoading = false;

    this.canLoad$.next(!this.isFinished && !this.isLoading);
    this.nextPage();
    this.cdRef.detectChanges();
  }

  private onCatchError(error: string): Observable<IArticleResponse> {
    this.error = error;
    this.isLoading = false;
    this.cdRef.detectChanges();

    return of({ articles: [], articlesCount: 0 });
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
    this.cdRef.detectChanges();
  }
}

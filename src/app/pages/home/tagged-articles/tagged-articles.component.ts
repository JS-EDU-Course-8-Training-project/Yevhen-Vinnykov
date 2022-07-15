import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  takeUntil,
  of,
} from 'rxjs';
import { IArticle, IArticleResponse } from 'src/app/shared/models/IArticle';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/infinite-scroll.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-tagged-articles',
  templateUrl: './tagged-articles.component.html',
  styleUrls: ['./tagged-articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaggedArticlesComponent
  extends TestedComponent
  implements OnChanges, OnDestroy, AfterViewInit
{
  @ViewChildren('lastItem', { read: ElementRef })
  lastItem!: QueryList<ElementRef>;

  @Input() isAuthorized = false;
  @Input() selectedTag!: string | null;
  @Input() tabIndex!: number;

  public articlesSelectedByTag: IArticle[] = [];
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

  ngOnChanges() {
    this.reset();
    if (this.tabIndex !== 2) return;
    this.getTaggedArticles();
    this.infiniteScroll.observeIntersection({
      canLoad: this.canLoad$,
      callback: this.getTaggedArticles.bind(this),
    });
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  ngAfterViewInit(): void {
    this.lastItem.changes.pipe(takeUntil(this.notifier)).subscribe((change) => {
      if (change.last)
        this.infiniteScroll.observer.observe(change.last.nativeElement);
    });
  }

  private getTaggedArticles() {
    if (!this.selectedTag) return;
    this.error = '';
    this.isLoading = true;
    this.cdRef.detectChanges();
    this.articlesService
      .fetchArticlesByTag(this.selectedTag, this.offset, this.limit)
      .pipe(
        takeUntil(this.notifier),
        catchError((err: HttpErrorResponse): any => this.onCatchError(err))
      )
      .subscribe((res: IArticleResponse | any) => this.setDataOnResponse(res));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onCatchError(error: HttpErrorResponse): Observable<IArticleResponse> {
    this.error = 'Something went wrong :(';
    this.isLoading = false;
    this.cdRef.detectChanges();
    return of({ articles: [], articlesCount: 0 });
  }

  private setDataOnResponse(response: IArticleResponse): void {
    this.articlesSelectedByTag = [
      ...this.articlesSelectedByTag,
      ...response.articles,
    ];
    this.pagesTotalCount = Math.ceil(response.articlesCount / this.limit);
    this.isFinished = this.currentPage === this.pagesTotalCount;
    this.isLoading = false;
    this.canLoad$.next(!this.isFinished && !this.isLoading);
    this.nextPage();
    this.cdRef.detectChanges();
  }

  private nextPage(): void {
    if (this.currentPage < this.pagesTotalCount) {
      this.currentPage++;
      this.offset += this.limit;
    }
  }

  private reset(): void {
    this.articlesSelectedByTag = [];
    this.offset = 0;
    this.isFinished = false;
    this.currentPage = 1;
    this.pagesTotalCount = 0;
    this.cdRef.detectChanges();
  }
}

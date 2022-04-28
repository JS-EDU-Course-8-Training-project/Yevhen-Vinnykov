import { BehaviorSubject, catchError, Observable, Subject, takeUntil } from 'rxjs';
import { IArticle, IArticleResponse } from 'src/app/shared/models/IArticle';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/infinite-scroll.service';

@Component({
  selector: 'app-tagged-articles',
  templateUrl: './tagged-articles.component.html',
  styleUrls: ['./tagged-articles.component.scss']
})
export class TaggedArticlesComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChildren('lastItem', { read: ElementRef }) lastItem!: QueryList<ElementRef>;

  @Input() isAuthorized: boolean = false;
  @Input() selectedTag!: string | null;
  @Input() tabIndex!: number;

  public articlesSelectedByTag: IArticle[] = [];
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

  ngOnChanges() {
    this.reset();
    if (this.tabIndex === 2) {
      this.getTaggedArticles();
      this.infiniteScroll
        .observeIntersection({ canLoad: this.canLoad$, callback: this.getTaggedArticles.bind(this) });
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

  private getTaggedArticles() {
    if (this.selectedTag) {
      this.isLoading = true;
      this.articlesService
        .fetchArticlesByTag(this.selectedTag, this.offset, this.limit)
        .pipe(
          takeUntil(this.notifier),
          catchError((err: HttpErrorResponse): any => this.onCatchError(err)))
        .subscribe((res: IArticleResponse | any) => this.setDataOnResponse(res));
    }
  }

  private onCatchError(error: HttpErrorResponse): void {
    console.error(error);
  }
  
  private setDataOnResponse(response: IArticleResponse): void {
    this.articlesSelectedByTag = [...this.articlesSelectedByTag, ...response.articles];
    this.pagesTotalCount = Math.ceil(response.articlesCount / this.limit);
    this.isFinished = this.currentPage === this.pagesTotalCount;
    this.isLoading = false;
    this.canLoad$.next(!this.isFinished && !this.isLoading);
    this.nextPage();
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
  }

}

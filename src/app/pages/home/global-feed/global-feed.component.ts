import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { IArticle, IArticleResponse } from 'src/app/shared/models/IArticle';
import {
  Component,
  OnChanges,
  Input,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/infinite-scroll.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-global-feed',
  templateUrl: './global-feed.component.html',
  styleUrls: ['./global-feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalFeedComponent
  extends TestedComponent
  implements OnChanges, AfterViewInit
{
  @ViewChildren('lastItem', { read: ElementRef })
  lastItem!: QueryList<ElementRef>;
  @Input() tabIndex!: number;
  @Input() isAuthorized!: boolean;

  public globalArticles: IArticle[] = [];
  public isLoading = false;
  private notifier: Subject<void> = new Subject<void>();
  public isFinished!: boolean;
  private offset = 0;
  private currentPage = 1;
  private pagesTotalCount!: number;
  private limit = 5;
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
    if (this.tabIndex === 1 || !this.isAuthorized) {
      this.getArticles();
      this.infiniteScroll.observeIntersection({
        canLoad: this.canLoad$,
        callback: this.getArticles.bind(this),
      });
    }
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

  private async getArticles(): Promise<void> {
    this.error = '';
    this.isLoading = true;
    this.cdRef.detectChanges();

    try {
      const articlesResponse = await this.articlesService.fetchArticles(
        this.offset,
        this.limit
      );
      this.setDataOnResponse(articlesResponse);
    } catch (error) {
      this.error = error as string;
    } finally {
      this.isLoading = false;
      this.cdRef.detectChanges();      
    }
  }

  private setDataOnResponse(res: IArticleResponse): void {
    this.globalArticles = [...this.globalArticles, ...res.articles];
    this.pagesTotalCount = Math.ceil(res.articlesCount / this.limit);
    this.isFinished = this.currentPage === this.pagesTotalCount;

    this.canLoad$.next(!this.isFinished);
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
    this.globalArticles = [];
    this.offset = 0;
    this.pagesTotalCount = 0;
    this.isFinished = false;
    this.currentPage = 1;
    this.cdRef.detectChanges();
  }
}

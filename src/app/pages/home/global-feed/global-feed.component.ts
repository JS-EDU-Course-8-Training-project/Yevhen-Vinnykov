import { Subject, takeUntil } from 'rxjs';
import {
  Component,
  OnChanges,
  Input,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/new-infinite-scroll.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { GlobalArticlesStore } from './global-feed.store';

@Component({
  selector: 'app-global-feed',
  templateUrl: './global-feed.component.html',
  styleUrls: ['./global-feed.component.scss'],
  providers: [GlobalArticlesStore, InfiniteScrollService],
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

  private notifier: Subject<void> = new Subject<void>();

  constructor(
    public store: GlobalArticlesStore,
    private scrollService: InfiniteScrollService
  ) {
    super();
  }

  ngOnChanges(): void {
    this.store.reset();

    if (this.tabIndex === 1 || !this.isAuthorized) {
      this.store.getArticles();
      this.scrollService.initObserver(() => this.store.getArticles());
    }
  }

  ngAfterViewInit(): void {
    this.lastItem.changes.pipe(takeUntil(this.notifier)).subscribe((change) => {
      if (change.last && !this.store.loadedAllArticles) {
        this.scrollService.observer.observe(change.last.nativeElement);
      }
    });
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
    this.scrollService.observer?.disconnect();
  }
}

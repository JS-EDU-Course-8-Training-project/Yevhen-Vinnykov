import { Subject, takeUntil } from 'rxjs';
import {
  Component,
  Input,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/infinite-scroll.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { IArticle } from 'src/app/shared/models/IArticle';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  providers: [InfiniteScrollService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent
  extends TestedComponent
  implements OnInit, AfterViewInit
{
  @ViewChildren('lastItem', { read: ElementRef })
  lastItem!: QueryList<ElementRef>;
  @Input() tabIndex!: number;
  @Input() isAuthorized!: boolean;
  @Input() selectedTag!: string | null;
  @Input() articles!: IArticle[];
  @Input() error!: string;
  @Input() loadedAllArticles!: boolean;
  @Input() isLoading!: boolean;
  @Input() cb!: () => void;

  private notifier: Subject<void> = new Subject<void>();

  constructor(private scrollService: InfiniteScrollService) {
    super();
  }

  ngOnInit(): void {
    this.scrollService.initObserver(this.cb);
  }

  ngAfterViewInit(): void {
    this.lastItem.changes.pipe(takeUntil(this.notifier)).subscribe((change) => {
      if (change.last && !this.loadedAllArticles) {
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

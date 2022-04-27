import { Subject, takeUntil } from 'rxjs';
import { IArticle } from 'src/app/shared/models/IArticle';
import { Component, Input, OnChanges, OnDestroy, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-your-feed',
  templateUrl: './your-feed.component.html',
  styleUrls: ['./your-feed.component.scss']
})
export class YourFeedComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChildren('lastItem', {read: ElementRef}) lastItem!: QueryList<ElementRef>;
  @Input() tabIndex!: number;

  public followedArticles: IArticle[] = [];
  public isLoading: boolean = false;
  private notifier: Subject<void> = new Subject<void>();
  public isFinished!: boolean;
  private offset: number = 0;
  private pagesTotalCount!: number;
  private limit: number = 5;
  private currentPage: number = 1;
  private observer!: IntersectionObserver;
  
  constructor(
    private articlesService: ArticlesService
  ) { }

  ngOnChanges(): void {
    this.reset();
    if (this.tabIndex === 0) {
      this.getFollowedArticles();
      this.observeIntersection();
    }
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  ngAfterViewInit(): void {
    this.lastItem.changes.subscribe(change => {
      if(change.last) this.observer.observe(change.last.nativeElement);
    });
  }

  private getFollowedArticles() {
    this.isLoading = true;
    this.articlesService.fetchFollowedArticles(this.offset, this.limit)
      .pipe(takeUntil(this.notifier))
      .subscribe(res => {
        if (!(res instanceof HttpErrorResponse)) {
          this.followedArticles = [...this.followedArticles, ...res.articles];
          this.pagesTotalCount = Math.ceil(res.articlesCount / this.limit);
          this.isFinished = this.currentPage === this.pagesTotalCount;
          this.isLoading = false;
        }
      });
  }

  private observeIntersection(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };
    this.observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting){
        if(!this.isFinished && !this.isLoading){
          this.offset += this.limit;
          this.getFollowedArticles();
          this.currentPage++;
        }
      }
    }, options);
  }

  private reset(): void {
    this.followedArticles = [];
    this.offset = 0;
    this.isFinished = false;
    this.currentPage = 1;
    this.pagesTotalCount = 0;
  }
}

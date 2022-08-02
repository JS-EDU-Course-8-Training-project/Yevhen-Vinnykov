import { IArticle, IArticleResponse } from 'src/app/shared/models/IArticle';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil, filter, BehaviorSubject } from 'rxjs';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { ArticlesStore } from 'src/app/shared/services/articles/articles.store';
import { SnackbarComponent } from 'src/app/components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  providers: [ArticlesStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent
  extends TestedComponent
  implements OnInit, OnDestroy
{
  public tabIndex = 0;
  public isLoading$ = new BehaviorSubject<boolean>(false);
  public currentPage = 0;
  public pagesTotalCount = 0;
  private offset = 0;
  private limit = 5;
  public error!: string;

  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    public store: ArticlesStore,
    private route: ActivatedRoute,
    private articlesService: ArticlesService,
    private snackbar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadArticles();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.notifier)
      )
      .subscribe(() => this.handleTabChange(0));
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public async loadArticles(): Promise<void> {
    this.isLoading$.next(true);
    try {
      const { articles, articlesCount } =
        this.tabIndex === 0
          ? await this.getMyArticles()
          : await this.getFavoritedArticles();
      this.onResponse(articles, articlesCount);
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private getMyArticles(): Promise<IArticleResponse> {
    return this.articlesService.fetchUserArticles(
      this.route.snapshot.params['user-name'],
      this.offset,
      this.limit
    );
  }

  private getFavoritedArticles(): Promise<IArticleResponse> {
    return this.articlesService.fetchFavoritedArticles(
      this.route.snapshot.params['user-name'],
      this.offset,
      this.limit
    );
  }

  private onResponse(articles: IArticle[], articlesCount: number): void {
    this.isLoading$.next(false);
    this.pagesTotalCount = Math.ceil(articlesCount / this.limit) || 1;
    this.store.articles$.next([...this.store.articles, ...articles]);

    if (this.currentPage < this.pagesTotalCount) {
      this.currentPage++;
      this.offset += this.limit;
    }

    if (articlesCount && this.store.articles.length === articlesCount) {
      this.onLoadedAllArticles();
    }
  }

  private onCatchError(error: string): void {
    this.isLoading$.next(false);
    this.error = error;
  }

  public handleTabChange(index: number): void {
    this.tabIndex = index;
    this.reset();
    this.loadArticles();
  }

  private reset(): void {
    this.store.articles$.next([]);

    this.offset = 0;
    this.currentPage = 0;
    this.pagesTotalCount = 0;
    this.error = '';
  }

  private onLoadedAllArticles(): void {
    this.snackbar.openFromComponent(SnackbarComponent, {
      data: 'These are all articles for now',
      duration: 2500,
    });
  }
}

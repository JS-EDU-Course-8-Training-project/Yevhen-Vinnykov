import { catchError, Subject, takeUntil } from 'rxjs';
import { IArticle, IArticleResponse } from '../../shared/models/IArticle';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent
  extends TestedComponent
  implements OnInit, OnDestroy
{
  @Input() article!: IArticle;
  public isLiked!: boolean;
  public isPending = false;
  public likesCount!: number;
  private isAuthorized!: boolean;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService,
    private redirectionService: RedirectionService,
    private authorizationService: AuthorizationService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.likesCount = this.article.favoritesCount;
    this.isLiked = this.article.favorited;

    this.authorizationService.isAuthorized$
      .pipe(takeUntil(this.notifier))
      .subscribe((isAuthorized) => (this.isAuthorized = isAuthorized));
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public handleLikeDislike(slug: string): void {
    if (!this.isAuthorized)
      return this.redirectionService.redirectUnauthorized();
    this.isPending = true;
    if (this.isLiked) return this.likeHandler(slug, 'removeFromFavorites');
    if (!this.isLiked) return this.likeHandler(slug, 'addToFavorites');
  }

  private likeHandler(
    slug: string,
    method: 'addToFavorites' | 'removeFromFavorites'
  ): void {
    this.articlesService[method](slug)
      .pipe(takeUntil(this.notifier))
      .pipe(catchError((err): any => console.log(err)))
      .subscribe((article: IArticleResponse | any) => {
        this.isLiked = article.favorited;
        this.isPending = false;
        this.likesCount = article.favoritesCount;
        this.cdRef.detectChanges();
      });
  }
}

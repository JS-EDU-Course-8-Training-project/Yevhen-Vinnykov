import { Subject, takeUntil } from 'rxjs';
import { IArticle } from '../../shared/models/IArticle';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit, OnDestroy {
  @Input() article!: IArticle;
  public isLiked!: boolean;
  public isPending: boolean = false;
  public likesCount!: number;
  private isAuthorized!: boolean;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.likesCount = this.article.favoritesCount;
    this.isLiked = this.article.favorited;
    this.authorizationService.isAuthorized$.pipe(takeUntil(this.notifier))
      .subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public handleLikeDislike(slug: string): void {
    if (!this.isAuthorized) return this.redirectUnauthorized();
    this.isPending = true;
    if (this.isLiked) return this.likeHandler(slug, 'removeFromFavorites');
    if (!this.isLiked) return this.likeHandler(slug, 'addToFavorites');
  }

  private likeHandler(slug: string, method: 'addToFavorites' | 'removeFromFavorites'): void {
    this.articlesService[method](slug).pipe(takeUntil(this.notifier))
      .subscribe(article => {
        if (!(article instanceof HttpErrorResponse)) {
          this.isLiked = article.favorited;
          this.isPending = false;
          this.likesCount = article.favoritesCount;
        }
      });
  }

  private redirectUnauthorized(): void {
    this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
  }
}

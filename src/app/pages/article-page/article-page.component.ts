import { Subject, takeUntil } from 'rxjs';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IArticle } from 'src/app/shared/models/IArticle';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss'],
})
export class ArticlePageComponent implements OnInit, OnDestroy {
  public slug: string = this.router.url.split('/')[2];
  public article!: IArticle;
  public authUser!: IExistingUser;
  public isLoaded: boolean = false;
  private notifier: Subject<void> = new Subject<void>();
  public requestForComments$: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService,
    private usersService: UsersService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getArticle();
    this.getAuthUser();
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public reuestComments(): void {
    this.requestForComments$.next();
  }

  private getAuthUser(): void {
    this.usersService.fetchAuthUser()
      .pipe(takeUntil(this.notifier))
      .subscribe(user => {
        if (!(user instanceof HttpErrorResponse)) {
          this.authUser = user;
        }
      });
  }

  private getArticle(): void {
    this.isLoaded = false;
    this.articlesService.fetchArticle(this.slug)
      .pipe(takeUntil(this.notifier))
      .subscribe(article => {
        if (!(article instanceof HttpErrorResponse)) {
          this.article = article;
          this.isLoaded = true;
        }
      });
  }
}

import { Subject, takeUntil } from 'rxjs';
import { CommentsService } from '../../shared/services/comments.service';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IArticle } from 'src/app/shared/models/IArticle';
import { Router } from '@angular/router';
import { IComment } from 'src/app/shared/models/IComment';
import { UsersService } from 'src/app/shared/services/users.service';
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
  public comments!: IComment[];
  public authUser!: IExistingUser;
  public isLoaded: boolean = false;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService,
    private commentsService: CommentsService,
    private usersService: UsersService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getArticle();
    this.getComments();
    this.getAuthUser();
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private getAuthUser(): void {
    this.usersService.fetchAuthUser()
      .pipe(
        takeUntil(this.notifier))
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

  public getComments(): void {
    this.isLoaded = false;
    this.commentsService.fetchArticleComments(this.slug)
      .pipe(takeUntil(this.notifier))
      .subscribe(comments => {
        if (!(comments instanceof HttpErrorResponse)) {
          this.comments = comments;
          this.isLoaded = true;
        }
      });
  }

  public deleteComment(id: number): void {
    this.commentsService.removeComment(this.slug, id)
      .pipe(takeUntil(this.notifier))
      .subscribe(() => {
        this.getComments();
      });
  }
}

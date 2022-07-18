import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IArticle } from 'src/app/shared/models/IArticle';
import { ActivatedRoute, Data } from '@angular/router';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss'],
})
export class ArticlePageComponent
  extends TestedComponent
  implements OnInit, OnDestroy
{
  public slug!: string;
  public article!: IArticle;
  public authUser!: IExistingUser;
  private notifier: Subject<void> = new Subject<void>();
  public requestForComments$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthorizationService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => {
      this.article = data['article'];
      this.slug = this.article.slug;
    });
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
    this.authService.authUser$
      .pipe(takeUntil(this.notifier))
      .subscribe((user) => (this.authUser = user));
  }
}

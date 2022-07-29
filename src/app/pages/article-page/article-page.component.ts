import { Subject } from 'rxjs';
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
  public isMyself!: boolean;
  private notifier: Subject<void> = new Subject<void>();

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

    this.authUser = this.authService.authUser$.getValue();
    this.isMyself = this.authUser.username === this.article.author.username;

    window.scrollTo(screenTop, 0);
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }
}

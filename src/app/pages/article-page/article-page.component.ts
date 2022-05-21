import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IArticle } from 'src/app/shared/models/IArticle';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';

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
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => this.article = data['article']);
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
    this.usersService.authUser$
      .pipe(takeUntil(this.notifier))
      .subscribe(user => this.authUser = user);
  }
}

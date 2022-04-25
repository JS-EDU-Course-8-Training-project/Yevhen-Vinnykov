import { IArticle } from '../../models/IArticle';
import { Component, Input, OnInit } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
  @Input() article!: IArticle;
  public isLiked!: boolean;
  public isPending: boolean = false;
  public likesCount!: number;
  private isAuthorized!: boolean;

  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.likesCount = this.article.favoritesCount;
    this.isLiked = this.article.favorited;
    this.authorizationService.isAuthorized$.subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }

  public handleLikeDislike(slug: string): void {
    if((!this.isAuthorized)) return this.redirectUnauthorized();
    this.isPending = true;
    if (this.isLiked) return this.dislikeArticle(slug);
    if (!this.isLiked) return this.likeArticle(slug);
  }

  private likeArticle(slug: string): void {
    this.articlesService.addToFavorites(slug).subscribe(article => {
      this.isLiked = article.favorited;
      this.isPending = false;
      this.likesCount = article.favoritesCount;
    })
  }

  private dislikeArticle(slug: string): void {
    this.articlesService.removeFromFavorites(slug).subscribe(article => {
      this.isLiked = article.favorited;
      this.likesCount = article.favoritesCount;
      this.isPending = false;
    })
  }

  private redirectUnauthorized(): void {
    this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
  }
}

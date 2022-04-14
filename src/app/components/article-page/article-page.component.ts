import { ArticlesService } from 'src/app/services/articles.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IArticle } from 'src/app/models/IArticle';
import { Router } from '@angular/router';
import { IComment } from 'src/app/models/IComment';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss'],
})
export class ArticlePageComponent implements OnInit {
  slug!: string;
  article!: IArticle;
  comments!: IComment[];
  isLoaded: boolean = false;
  likesCount!: number;
  isLiked!: boolean;
  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.slug = this.router.url.split('/')[2];
    this.getArticle();
    this.getComments();
  }

  handleLike(): void {
    this.likesCount = this.isLiked ? --this.likesCount : ++this.likesCount;
    this.isLiked = !this.isLiked;
  }

  getArticle(): void {
    this.isLoaded = false;
    this.articlesService.fetchArticle(this.slug)
    .subscribe(article => {
      this.article = article;
      this.likesCount = article.favoritesCount;
      this.isLiked = article.favorited;
      this.isLoaded = true;
    });
  }

  getComments(): void {
    this.isLoaded = false;
    this.articlesService.fetchArticleComments(this.slug)
    .subscribe(comments => {
      this.comments = comments;
      console.log(this.comments);
      this.isLoaded = true;
    });
  }

}

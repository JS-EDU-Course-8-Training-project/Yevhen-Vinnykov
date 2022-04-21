import { CommentsService } from './../../services/comments.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { Component, OnInit } from '@angular/core';
import { IArticle } from 'src/app/models/IArticle';
import { Router } from '@angular/router';
import { IComment } from 'src/app/models/IComment';
import { UsersService } from 'src/app/services/users.service';
import { IExistingUser } from 'src/app/models/IExistingUser';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss'],
})
export class ArticlePageComponent implements OnInit {
  slug: string = this.router.url.split('/')[2];
  article!: IArticle;
  comments!: IComment[];
  authUser!: IExistingUser;
  isLoaded: boolean = false;

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

  getAuthUser(): void {
    this.usersService.fetchAuthUser().subscribe(user => {
      this.authUser = user; 
    });
  }

  getArticle(): void {
    this.isLoaded = false;
    this.articlesService.fetchArticle(this.slug)
      .subscribe(article => {
        console.log(article);
        this.article = article;
        this.isLoaded = true;
      });
  }

  getComments(): void {
    this.isLoaded = false;
    this.commentsService.fetchArticleComments(this.slug)
      .subscribe(comments => {
        this.comments = comments;
        console.log(this.comments);
        this.isLoaded = true;
      });
  }

  deleteComment(id: number): void {
    this.commentsService.removeComment(this.slug, id).subscribe(() => {
      this.getComments();
    });
  }
}

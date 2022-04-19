import { IUser } from './../../models/IUser';
import { CommentsService } from './../../services/comments.service';
import { ProfilesService } from 'src/app/services/profiles.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { Component, OnInit } from '@angular/core';
import { IArticle } from 'src/app/models/IArticle';
import { Router } from '@angular/router';
import { IComment } from 'src/app/models/IComment';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss'],
})
export class ArticlePageComponent implements OnInit {
  slug!: string;
  article!: IArticle;
  comments!: IComment[];
  authUser!: IUser;
  isLoaded: boolean = false;
  isLiked!: boolean;
  likesCount: number = 0;
  isFollowed!: boolean;
  followingInProgress!: boolean;
  favouriteInProgress!: boolean;

  constructor(
    private articlesService: ArticlesService,
    private commentsService: CommentsService,
    private usersService: UsersService,
    private router: Router,
    private profilesService: ProfilesService
  ) { }

  ngOnInit(): void {
    this.slug = this.router.url.split('/')[2];
    this.getArticle();
    this.getComments();
    this.getAuthUser();
  }

  getAuthUser(): void {
    this.usersService.fetchAuthUser().subscribe(res => {
      this.authUser = res.user;
    });
  }

  handleLike(slug: string): void {
    if (localStorage.getItem('authorized') !== 'true') {
      this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
      return;
    }

    this.favouriteInProgress = true;
    if (this.isLiked) {
      this.articlesService.removeFromFavorites(slug).subscribe(article => {
        this.isLiked = article.favorited;
        this.likesCount = article.favoritesCount;
        console.log(article);
        this.favouriteInProgress = false;

      })
    } else {
      this.articlesService.addToFavorites(slug).subscribe(article => {
        this.isLiked = article.favorited;
        this.favouriteInProgress = false;
        this.likesCount = article.favoritesCount;
        console.log(article);
      })
    }
  }

  getArticle(): void {
    this.isLoaded = false;
    this.articlesService.fetchArticle(this.slug)
      .subscribe(article => {
        console.log(article);
        this.article = article;
        this.isLiked = article.favorited;
        this.likesCount = article.favoritesCount;
        this.isLoaded = true;
        this.isFollowed = article.author.following;
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


  handleFollowUnfollow(username: string): void {
    if (localStorage.getItem('authorized') !== 'true') {
      this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
      return;
    }
    this.followingInProgress = true;
    if (this.isFollowed) {
      this.profilesService.unfollow(username).subscribe((profile => {
        this.isFollowed = profile.following;
        console.log('unfollow', profile);
        this.followingInProgress = false;
      }));
    } else {
      this.profilesService.follow(username).subscribe(profile => {
        this.isFollowed = profile.following;
        console.log('follow', profile);
        this.followingInProgress = false;
      });
    }
  }

}

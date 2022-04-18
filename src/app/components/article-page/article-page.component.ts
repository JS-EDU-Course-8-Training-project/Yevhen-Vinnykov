import { ProfilesService } from 'src/app/services/profiles.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { Component, OnInit } from '@angular/core';
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
  isLiked!: boolean;
  likesCount!: number;
  isFollowed!: boolean;
  followingInProgress!: boolean;
  favouriteInProgress!: boolean;

  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private profilesService: ProfilesService
  ) { }

  ngOnInit(): void {
    this.slug = this.router.url.split('/')[2];
    this.getArticle();
    this.getComments();
  }
  
  handleLike(slug: string): void {
    if(localStorage.getItem('authorized') !== 'true') {
      this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
      return;
    }
    
    this.favouriteInProgress = true;
    if(this.isLiked){
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
    this.articlesService.fetchArticleComments(this.slug)
      .subscribe(comments => {
        this.comments = comments;
        console.log(this.comments);
        this.isLoaded = true;
      });
  }

  handleFollowUnfollow(username: string): void {
    if(localStorage.getItem('authorized') !== 'true'){
      this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
      return;
    }
    this.followingInProgress = true;
    if(this.isFollowed){
      this.profilesService.unfollow(username).subscribe((profile => {
        this.isFollowed = profile.following;
        console.log('unfollow',profile);
        this.followingInProgress = false;
      }));
    } else {
      this.profilesService.follow(username).subscribe(profile => {
        this.isFollowed = profile.following;
        console.log('follow',profile);
        this.followingInProgress = false;
      });
    }
  }

}

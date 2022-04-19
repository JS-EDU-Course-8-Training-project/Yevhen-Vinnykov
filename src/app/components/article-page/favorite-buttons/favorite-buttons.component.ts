import { IArticle } from 'src/app/models/IArticle';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ArticlesService } from 'src/app/services/articles.service';
import { ProfilesService } from 'src/app/services/profiles.service';

@Component({
  selector: 'app-favorite-buttons',
  templateUrl: './favorite-buttons.component.html',
  styleUrls: ['./favorite-buttons.component.scss']
})
export class FavoriteButtonsComponent implements OnInit, OnChanges{
  @Input() article!: IArticle;
  @Input() slug!: string;

  favoriteInProgress: boolean = false;
  followingInProgress: boolean = false;
  isLiked!: boolean;
  likesCount!: number;
  isFollowed!: boolean;
  username!: string;

  constructor(
    private router: Router,
    private articlesService: ArticlesService,
    private profilesService: ProfilesService
  ) { }

  ngOnInit(): void {
    this.setData();   
  }

  ngOnChanges(): void {
    this.setData();
 }

 private setData(): void {
  this.isLiked = this.article.favorited;
  this.isFollowed = this.article.author.following;
  this.likesCount = this.article.favoritesCount;
  this.username = this.article.author.username; 
 }
 
  handleLike(slug: string): void {
    if (localStorage.getItem('authorized') !== 'true') {
      this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
      return;
    }
    this.favoriteInProgress = true;
    if (this.isLiked) {
      this.articlesService.removeFromFavorites(slug).subscribe(article => {
        this.isLiked = article.favorited;
        this.likesCount = article.favoritesCount;
        console.log(article);
        this.favoriteInProgress = false;

      })
    } else {
      this.articlesService.addToFavorites(slug).subscribe(article => {
        this.isLiked = article.favorited;
        this.favoriteInProgress = false;
        this.likesCount = article.favoritesCount;
        console.log(article);
      })
    }
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

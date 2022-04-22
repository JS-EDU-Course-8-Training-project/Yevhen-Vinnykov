import { IArticle } from 'src/app/models/IArticle';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ArticlesService } from 'src/app/services/articles.service';
import { ProfilesService } from 'src/app/services/profiles.service';
import { IExistingUser } from 'src/app/models/IExistingUser';

@Component({
  selector: 'app-favorite-buttons',
  templateUrl: './favorite-buttons.component.html',
  styleUrls: ['./favorite-buttons.component.scss']
})
export class FavoriteButtonsComponent implements OnInit, OnChanges {
  @Input() article!: IArticle;
  @Input() slug!: string;
  @Input() authUser!: IExistingUser;

  favoriteInProgress: boolean = false;
  followingInProgress: boolean = false;
  isLiked!: boolean;
  likesCount!: number;
  isFollowed!: boolean;
  username!: string;
  isAuthor!: boolean;

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
    this.isLiked = this.article?.favorited;
    this.isFollowed = this.article?.author?.following;
    this.likesCount = this.article?.favoritesCount;
    this.username = this.article?.author?.username;
    this.isAuthor = this.article?.author?.username === this.authUser?.username;
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
        this.favoriteInProgress = false;

      })
    } else {
      this.articlesService.addToFavorites(slug).subscribe(article => {
        this.isLiked = article.favorited;
        this.favoriteInProgress = false;
        this.likesCount = article.favoritesCount;
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
        this.followingInProgress = false;
      }));
    } else {
      this.profilesService.follow(username).subscribe(profile => {
        this.isFollowed = profile.following;
        this.followingInProgress = false;
      });
    }
  }

  deleteArticle(slug: string): void {
    this.articlesService.deleteArticle(slug).subscribe(() => {
      this.router.navigateByUrl('/').catch(err => console.log(err));
    });
  }
  editArticle(slug: string): void {
    this.router.navigateByUrl(`/edit-article/${slug}`).catch(err => console.log(err));
  }
}

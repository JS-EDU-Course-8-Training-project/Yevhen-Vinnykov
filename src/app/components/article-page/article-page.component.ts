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
  likesCount!: number;
  isLiked!: boolean;
  isFollowed!: boolean;

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
    if(this.isFollowed){
      this.profilesService.unfollow(username).subscribe((profile => {
        console.log(profile.following);
        
      }));
    } else {
      this.profilesService.follow(username).subscribe((profile: any) => {
        console.log(profile);
        console.log(profile.following);
      });
    }
  }

}

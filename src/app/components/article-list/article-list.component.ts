import { IArticle } from '../../models/IArticle';
import { Component, Input, OnInit } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
  isLiked!: boolean;
  favoriteInProgress: boolean = false;
  likesCount!: number;
  @Input() article!: IArticle;
  constructor(private articlesService: ArticlesService, private router: Router) {}

  handleLike(slug: string): void {
    if(localStorage.getItem('authorized') !== 'true'){
      this.router.navigateByUrl('/sign-in').catch((err: any) => console.log(err));
      return;
    }
    this.favoriteInProgress = true;
    if(this.isLiked){
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

  ngOnInit(): void {
   this.likesCount = this.article.favoritesCount;
   this.isLiked = this.article.favorited;
  }

}

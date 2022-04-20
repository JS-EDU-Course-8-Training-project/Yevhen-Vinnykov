import { ArticlesService } from 'src/app/services/articles.service';
import { IArticle } from 'src/app/models/IArticle';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorited-articles',
  templateUrl: './favorited-articles.component.html',
  styleUrls: ['./favorited-articles.component.scss']
})
export class FavoritedArticlesComponent implements OnInit {
favoritedArticles: IArticle[] = [];
isLoading: boolean = false;
constructor(private articlesService: ArticlesService) { }

ngOnInit(): void {
 this.getArticles();
}
getArticles(): void {
  this.isLoading = true;
  this.articlesService.fetchArticles().subscribe(res => {
    this.favoritedArticles = res.articles;
    this.isLoading = false;
  });
}

}


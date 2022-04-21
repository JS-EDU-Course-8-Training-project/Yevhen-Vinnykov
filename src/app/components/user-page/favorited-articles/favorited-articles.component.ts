import { ArticlesService } from 'src/app/services/articles.service';
import { IArticle } from 'src/app/models/IArticle';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-favorited-articles',
  templateUrl: './favorited-articles.component.html',
  styleUrls: ['./favorited-articles.component.scss']
})
export class FavoritedArticlesComponent implements OnChanges {
  @Input() username!: string;
  @Input() tabIndex!: number;
  favoritedArticles: IArticle[] = [];
  isLoading: boolean = false;
  constructor(private articlesService: ArticlesService) { }

  ngOnChanges(): void {
    this.getArticles();
  }

  getArticles(): void {
    this.isLoading = true;
    this.articlesService.fetchFavoritedArticles(this.username).subscribe(res => {
      this.favoritedArticles = res.articles;
      this.isLoading = false;
    });
  }
}


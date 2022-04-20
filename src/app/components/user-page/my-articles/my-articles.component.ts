import { ArticlesService } from 'src/app/services/articles.service';
import { IArticle } from 'src/app/models/IArticle';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-articles',
  templateUrl: './my-articles.component.html',
  styleUrls: ['./my-articles.component.scss']
})
export class MyArticlesComponent implements OnInit {
  myArticles: IArticle[] = [];
  isLoading: boolean = false;
  constructor(private articlesService: ArticlesService) { }

  ngOnInit(): void {
   this.getArticles();
  }
  getArticles(): void {
    this.isLoading = true;
    this.articlesService.fetchArticles().subscribe(res => {
      this.myArticles = res.articles;
      this.isLoading = false;
    });
  }

}

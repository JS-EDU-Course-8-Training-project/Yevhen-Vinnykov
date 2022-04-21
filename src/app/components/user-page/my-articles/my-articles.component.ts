import { ArticlesService } from 'src/app/services/articles.service';
import { IArticle } from 'src/app/models/IArticle';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-my-articles',
  templateUrl: './my-articles.component.html',
  styleUrls: ['./my-articles.component.scss']
})
export class MyArticlesComponent implements OnChanges{
  @Input() username!: string;
  myArticles: IArticle[] = [];
  isLoading: boolean = false;
  constructor(
    private articlesService: ArticlesService,
  ) { }

  ngOnChanges(): void {
    this.getArticles();
  }

  getArticles(): void {
    this.isLoading = true;
    this.articlesService.fetchUserArticles(this.username).subscribe(res => {
      this.myArticles = res.articles;
      this.isLoading = false;
    });
  }
}

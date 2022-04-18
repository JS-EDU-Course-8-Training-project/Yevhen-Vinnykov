import { IArticle } from 'src/app/models/IArticle';
import { Component, OnInit } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-global-feed',
  templateUrl: './global-feed.component.html',
  styleUrls: ['./global-feed.component.scss']
})
export class GlobalFeedComponent implements OnInit {
  globalArticles: IArticle[] = [];
  isLoading: boolean = false;
  constructor(private articlesService: ArticlesService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.articlesService.fetchArticles().subscribe(res => {
      this.globalArticles = res.articles;
      this.isLoading = false;
    });
  }

}

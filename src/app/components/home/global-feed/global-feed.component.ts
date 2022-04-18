import { IArticle } from 'src/app/models/IArticle';
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-global-feed',
  templateUrl: './global-feed.component.html',
  styleUrls: ['./global-feed.component.scss']
})
export class GlobalFeedComponent implements OnInit, OnChanges {
  @Input() tabIndex!: number;
  globalArticles: IArticle[] = [];
  isLoading: boolean = false;
  constructor(private articlesService: ArticlesService) { }

  ngOnInit(): void {
   this.getArticles();
  }
  ngOnChanges(): void {
    this.getArticles();
  }
  getArticles(): void {
    this.isLoading = true;
    this.articlesService.fetchArticles().subscribe(res => {
      this.globalArticles = res.articles;
      this.isLoading = false;
    });
  }
}

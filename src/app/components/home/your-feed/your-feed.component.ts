import { IArticle } from 'src/app/models/IArticle';
import { Component, Input, OnInit } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-your-feed',
  templateUrl: './your-feed.component.html',
  styleUrls: ['./your-feed.component.scss']
})
export class YourFeedComponent implements OnInit {
  @Input() tabIndex!: number;
  followedArticles: IArticle[] = [];
  isLoading: boolean = false;
  constructor(private articlesService: ArticlesService) { }

  ngOnInit(): void {
    this.getFollowedArticles();
  }
  ngOnChanges(): void {
    this.getFollowedArticles();
  }
  getFollowedArticles() {
    this.isLoading = true;
    this.articlesService.fetchFollowedArticles().subscribe(res => {
      this.followedArticles = res.articles;
      this.isLoading = false;
    });
  }

}

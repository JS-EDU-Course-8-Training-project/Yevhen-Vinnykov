import { IArticle } from 'src/app/models/IArticle';
import { Component, Input, OnChanges } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-your-feed',
  templateUrl: './your-feed.component.html',
  styleUrls: ['./your-feed.component.scss']
})
export class YourFeedComponent implements OnChanges {
  @Input() tabIndex!: number;
  public followedArticles: IArticle[] = [];
  public isLoading: boolean = false;

  constructor(
    private articlesService: ArticlesService
  ) { }

  ngOnChanges(): void {
    if (this.tabIndex === 0) {
      this.getFollowedArticles();
    }
  }

  private getFollowedArticles() {
    this.isLoading = true;
    this.articlesService.fetchFollowedArticles().subscribe(res => {
      this.followedArticles = res.articles;
      this.isLoading = false;
    });
  }

}

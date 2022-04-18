import { IArticle } from 'src/app/models/IArticle';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-tagged-articles',
  templateUrl: './tagged-articles.component.html',
  styleUrls: ['./tagged-articles.component.scss']
})
export class TaggedArticlesComponent implements OnInit, OnChanges {
  @Input() isAuthorized: boolean = false;
  @Input() selectedTag!: string | null;
  articlesSelectedByTag: IArticle[] = [];
  isLoading: boolean = false;

  constructor(private articlesService: ArticlesService) { }

  ngOnChanges() {
    this.getFollowedArticles();
  }

  ngOnInit(): void {
    this.getFollowedArticles();
  }

  getFollowedArticles() {
    if (this.selectedTag) {
      this.isLoading = true;
      this.articlesService
        .fetchArticlesByTag(this.selectedTag)
        .subscribe(res => {
          this.articlesSelectedByTag = res.articles;
          this.isLoading = false;
        });
    }
  }
}

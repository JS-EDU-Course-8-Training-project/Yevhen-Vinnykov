import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IArticle } from 'src/app/models/IArticle';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  articles: IArticle[] = [];
  isLoading: boolean = false;
  articlesSelectedByTag: IArticle[] = [];
  tags: string[] = [];
  selectedTag!: string | null;
  tabIndex: number = 0;

  isAuthorized: boolean = false;
  constructor(
    private articlesService: ArticlesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading = true;
    this.articlesService.fetchArticles().subscribe(res => {
      this.articles = res.articles;
      this.isLoading = false;
    });
    this.articlesService.fetchTags().subscribe(tags => this.tags = tags);
    if (localStorage.getItem('authorized') === 'true') {
      this.isAuthorized = true;
    }
  }

  selectTag(tag: string): void {
    this.isLoading = true;
    this.selectedTag = tag;
    this.tabIndex = 2;
    this.articlesService
      .fetchArticlesByTag(this.selectedTag)
      .subscribe(res => {
        this.articlesSelectedByTag = res.articles;
        this.isLoading = false;
      });
  }

  handleChange(index: number): void {
    this.tabIndex = index;
    if (index !== 2) {
      this.selectedTag = null;
      this.articlesSelectedByTag = [];
    }
  }

}

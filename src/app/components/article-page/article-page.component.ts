import { Subject, Observable } from 'rxjs';
import { ArticlesService } from 'src/app/services/articles.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IArticle } from 'src/app/models/IArticle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss'],
})
export class ArticlePageComponent implements OnInit {
  public article!: Observable<IArticle>;
  isLoaded: boolean = false;
  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getArticle();
  }


  getArticle(): void {
    const slug = this.router.url.split('/')[2];
    this.isLoaded = false;
    this.article = this.articlesService.fetchArticle(slug)
    //.subscribe(article => {
    //   this.article = article;
    //   this.ref.detectChanges();
    //   console.log(this.article);
    //   this.isLoaded = true;
    // });
  }

}

import { Subject, takeUntil } from 'rxjs';
import { ArticlesService } from 'src/app/services/articles.service';
import { IArticle } from 'src/app/models/IArticle';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-my-articles',
  templateUrl: './my-articles.component.html',
  styleUrls: ['./my-articles.component.scss']
})
export class MyArticlesComponent implements OnChanges, OnDestroy {
  @Input() username!: string;
  @Input() tabIndex!: number;

  public myArticles: IArticle[] = [];
  public isLoading: boolean = false;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService,
  ) { }

  ngOnChanges(): void {
    if (this.tabIndex === 0) {
      this.getArticles();
    }
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private getArticles(): void {
    this.isLoading = true;
    this.articlesService.fetchUserArticles(this.username)
      .pipe(takeUntil(this.notifier))
      .subscribe(res => {
        this.myArticles = res.articles;
        this.isLoading = false;
      });
  }
}

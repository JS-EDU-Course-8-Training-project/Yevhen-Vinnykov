import { MatDialog } from '@angular/material/dialog';
import { IArticle } from '../../shared/models/IArticle';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCardComponent extends TestedComponent implements OnInit {
  @Input() article!: IArticle;
  
  public isLiked!: boolean;
  public isLoading = false;
  public likesCount!: number;
  private isAuth!: boolean;

  constructor(
    private articlesService: ArticlesService,
    private redirectionService: RedirectionService,
    private authorizationService: AuthorizationService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.likesCount = this.article.favoritesCount;
    this.isLiked = this.article.favorited;
    this.isAuth = this.authorizationService.isAuthorized$.getValue();
  }

  public async like(slug: string) {
    if (!this.isAuth) return this.redirectionService.redirectUnauthorized();

    this.isLoading = true;
    try {
      const { favorited, favoritesCount } =
        await this.articlesService.addToFavorites(slug);

      this.isLiked = favorited;
      this.likesCount = favoritesCount;
      this.isLoading = false;

      this.cdRef.detectChanges();
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  public async dislike(slug: string) {
    if (!this.isAuth) return this.redirectionService.redirectUnauthorized();

    this.isLoading = true;
    try {
      const { favorited, favoritesCount } =
        await this.articlesService.removeFromFavorites(slug);

      this.isLiked = favorited;
      this.likesCount = favoritesCount;
      this.isLoading = false;

      this.cdRef.detectChanges();
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private onCatchError(error: string): void {
    this.isLoading = false;
    this.dialog.open(ErrorDialogComponent, { data: error });
  }
}

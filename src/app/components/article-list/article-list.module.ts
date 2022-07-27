import { NgModule } from '@angular/core';
import { ArticleListComponent } from './article-list.component';
import { RouterModule } from '@angular/router';
import { ErrorDialogModule } from '../error-dialog/error-dialog.module';
import { ArticleCardModule } from '../article-card/article-card.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  declarations: [ArticleListComponent],
  imports: [RouterModule, ErrorDialogModule, ArticleCardModule, SharedModule],
  exports: [ArticleListComponent],
})
export class ArticleListModule {}

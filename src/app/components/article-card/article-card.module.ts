import { NgModule } from '@angular/core';
import { ArticleCardComponent } from './article-card.component';
import { RouterModule } from '@angular/router';
import { ErrorDialogModule } from '../error-dialog/error-dialog.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  declarations: [ArticleCardComponent],
  imports: [RouterModule, ErrorDialogModule, SharedModule],
  exports: [ArticleCardComponent],
})
export class ArticleCardModule {}

import { NgModule } from '@angular/core';
import { ArticleListComponent } from './article-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ErrorDialogModule } from '../error-dialog/error-dialog.module';

@NgModule({
  declarations: [ArticleListComponent],
  imports: [RouterModule, SharedModule, ErrorDialogModule],
  exports: [ArticleListComponent],
})
export class ArticleListModule {}

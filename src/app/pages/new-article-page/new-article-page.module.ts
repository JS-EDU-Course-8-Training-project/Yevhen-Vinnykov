import { NgModule } from '@angular/core';

import { NewArticlePageRoutingModule } from './new-article-page-routing.module';
import { NewArticlePageComponent } from './new-article-page.component';
import { ConfirmationDialogModule } from 'src/app/components/confirmation-dialog/confirmation-dialog.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  declarations: [NewArticlePageComponent],
  imports: [
    NewArticlePageRoutingModule,
    ConfirmationDialogModule,
    SharedModule,
  ],
})
export class NewArticlePageModule {}

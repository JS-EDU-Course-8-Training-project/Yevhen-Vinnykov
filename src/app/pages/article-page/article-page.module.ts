import { NgModule } from '@angular/core';

import { ArticlePageRoutingModule } from './article-page-routing.module';
import { BannerModule } from '../../components/banner/banner.module';

import { CommentsComponent } from './comments/comments.component';
import { ArticlePageComponent } from './article-page.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { ArticleBodyComponent } from './article-body/article-body.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ButtonsModule } from './buttons/buttons.module';

@NgModule({
  declarations: [
    ArticlePageComponent,
    CommentFormComponent,
    ArticleBodyComponent,
    CommentsComponent,
  ],
  imports: [
    ArticlePageRoutingModule,
    BannerModule,
    SharedModule,
    ButtonsModule,
  ],
})
export class ArticlePageModule {}

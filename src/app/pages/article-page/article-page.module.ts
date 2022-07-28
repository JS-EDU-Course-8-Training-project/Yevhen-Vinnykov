import { NgModule } from '@angular/core';

import { ArticlePageRoutingModule } from './article-page-routing.module';
import { BannerModule } from '../../components/banner/banner.module';

import { CommentsComponent } from './comments/comments.component';
import { ArticlePageComponent } from './article-page.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { ArticleBodyComponent } from './article-body/article-body.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ButtonsModule } from '../../components/buttons/buttons.module';
import { ArticleBannerComponent } from './article-banner/article-banner.component';

@NgModule({
  declarations: [
    ArticlePageComponent,
    CommentFormComponent,
    ArticleBodyComponent,
    CommentsComponent,
    ArticleBannerComponent,
  ],
  imports: [
    ArticlePageRoutingModule,
    BannerModule,
    SharedModule,
    ButtonsModule,
  ],
})
export class ArticlePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlePageRoutingModule } from './article-page-routing.module';
import { BannerModule } from '../../components/banner/banner.module';

import { CommentsComponent } from './comments/comments.component';
import { ArticlePageComponent } from './article-page.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { ArticleBodyComponent } from './article-body/article-body.component';
import { ArticlePageButtonsComponent } from './article-page-buttons/article-page-buttons.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  declarations: [
    ArticlePageComponent,
    CommentFormComponent,
    ArticleBodyComponent,
    ArticlePageButtonsComponent,
    CommentsComponent,
  ],
  imports: [ArticlePageRoutingModule, BannerModule, SharedModule],
})
export class ArticlePageModule {}

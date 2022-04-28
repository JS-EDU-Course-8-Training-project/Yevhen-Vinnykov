import { CommentsComponent } from './comments/comments.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlePageRoutingModule } from './article-page-routing.module';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { ArticlePageComponent } from './article-page.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { BannerModule } from '../banner/banner.module';
import { ArticleBodyComponent } from './article-body/article-body.component';
import { ArticlePageButtonsComponent } from './article-page-buttons/article-page-buttons.component';


@NgModule({
  declarations: [
    ArticlePageComponent,
    CommentFormComponent,
    ArticleBodyComponent,
    ArticlePageButtonsComponent,
    CommentsComponent,
  ],
  imports: [
    CommonModule,
    ArticlePageRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    BannerModule,
    MatButtonModule,
  ]
})
export class ArticlePageModule { }

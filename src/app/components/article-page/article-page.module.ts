import { MatButtonModule } from '@angular/material/button';
//import { BannerComponent } from './../banner/banner.component';
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
import { FavoriteButtonsComponent } from './favorite-buttons/favorite-buttons.component';


@NgModule({
  declarations: [
    ArticlePageComponent,
    CommentFormComponent,
    ArticleBodyComponent,
    FavoriteButtonsComponent,
  ],
  imports: [
    CommonModule,
    ArticlePageRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    BannerModule,
    MatButtonModule,
  ]
})
export class ArticlePageModule { }

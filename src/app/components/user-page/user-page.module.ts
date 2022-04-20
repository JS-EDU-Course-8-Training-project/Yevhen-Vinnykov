import { ArticleListComponent } from './../article-list/article-list.component';
import { MatButtonModule } from '@angular/material/button';
import { BannerModule } from './../banner/banner.module';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPageRoutingModule } from './user-page-routing.module';
import { UserPageComponent } from './user-page.component';
import { MyArticlesComponent } from './my-articles/my-articles.component';
import { FavoritedArticlesComponent } from './favorited-articles/favorited-articles.component';
import { ArticleListModule } from '../article-list/article-list.module';


@NgModule({
  declarations: [
    UserPageComponent,
    MyArticlesComponent,
    FavoritedArticlesComponent,
  ],
  imports: [
    CommonModule,
    UserPageRoutingModule,
    MatTabsModule,
    MatCardModule,
    BannerModule,
    MatButtonModule,
    ArticleListModule
  ]
})
export class UserPageModule { }

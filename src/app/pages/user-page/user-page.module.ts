import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { BannerModule } from '../../components/banner/banner.module';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPageRoutingModule } from './user-page-routing.module';
import { UserPageComponent } from './user-page.component';
import { MyArticlesComponent } from './my-articles/my-articles.component';
import { FavoritedArticlesComponent } from './favorited-articles/favorited-articles.component';
import { ArticleListModule } from '../../components/article-list/article-list.module';
import { SharedModule } from 'src/app/shared/shared.module';

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
    MatProgressSpinnerModule,
    BannerModule,
    MatButtonModule,
    ArticleListModule,
    SharedModule,
  ],
})
export class UserPageModule {}

import { BannerModule } from '../../components/banner/banner.module';
import { NgModule } from '@angular/core';

import { UserPageRoutingModule } from './user-page-routing.module';
import { UserPageComponent } from './user-page.component';
import { MyArticlesComponent } from './my-articles/my-articles.component';
import { FavoritedArticlesComponent } from './favorited-articles/favorited-articles.component';
import { ArticleListModule } from '../../components/article-list/article-list.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  declarations: [
    UserPageComponent,
    MyArticlesComponent,
    FavoritedArticlesComponent,
  ],
  imports: [
    UserPageRoutingModule,
    BannerModule,
    ArticleListModule,
    SharedModule,
  ],
})
export class UserPageModule {}

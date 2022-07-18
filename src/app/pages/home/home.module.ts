import { SharedModule } from '../../shared/modules/shared.module';
import { NgModule } from '@angular/core';
import { BannerModule } from '../../components/banner/banner.module';

import { TagsComponent } from './tags/tags.component';
import { ArticleListModule } from '../../components/article-list/article-list.module';
import { GlobalFeedComponent } from './global-feed/global-feed.component';
import { YourFeedComponent } from './your-feed/your-feed.component';
import { TaggedArticlesComponent } from './tagged-articles/tagged-articles.component';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    GlobalFeedComponent,
    HomeComponent,
    YourFeedComponent,
    TaggedArticlesComponent,
    TagsComponent,
  ],
  imports: [
    ArticleListModule,
    BannerModule,
    SharedModule,
  ],
})
export class HomeModule {}

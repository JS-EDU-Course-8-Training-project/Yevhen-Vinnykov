import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
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
    CommonModule,
    ArticleListModule,
    MatCardModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    BannerModule,
    SharedModule,
  ],
})
export class HomeModule {}

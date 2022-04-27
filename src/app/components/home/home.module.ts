import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { TagsComponent } from './tags/tags.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListModule } from '../article-list/article-list.module';
import { GlobalFeedComponent } from './global-feed/global-feed.component';
import { YourFeedComponent } from './your-feed/your-feed.component';
import { TaggedArticlesComponent } from './tagged-articles/tagged-articles.component';
import { HomeComponent } from './home.component';
import { BannerModule } from '../banner/banner.module';



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
    BannerModule
  ],
})
export class HomeModule { }

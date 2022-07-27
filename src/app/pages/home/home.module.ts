import { SharedModule } from '../../shared/modules/shared.module';
import { NgModule } from '@angular/core';
import { BannerModule } from '../../components/banner/banner.module';

import { TagsComponent } from './tags/tags.component';
import { HomeComponent } from './home.component';
import { ArticleListModule } from 'src/app/components/article-list/article-list.module';

@NgModule({
  declarations: [
    HomeComponent,
    TagsComponent,
  ],
  imports: [
    BannerModule,
    SharedModule,
    ArticleListModule
  ],
})
export class HomeModule {}

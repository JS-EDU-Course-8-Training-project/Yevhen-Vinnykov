import { BannerModule } from '../../components/banner/banner.module';
import { NgModule } from '@angular/core';

import { UserPageRoutingModule } from './user-page-routing.module';
import { UserPageComponent } from './user-page.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ArticleListModule } from 'src/app/components/article-list/article-list.module';

@NgModule({
  declarations: [
    UserPageComponent,
  ],
  imports: [
    UserPageRoutingModule,
    BannerModule,
    ArticleListModule,
    SharedModule,
  ],
})
export class UserPageModule {}

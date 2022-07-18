import { NgModule } from '@angular/core';
import { BannerComponent } from './banner.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  declarations: [BannerComponent],
  imports: [SharedModule],
  exports: [BannerComponent],
})
export class BannerModule {}

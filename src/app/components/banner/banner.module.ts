import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner.component';



@NgModule({
  declarations: [
    BannerComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [
    BannerComponent
  ]
})
export class BannerModule { }

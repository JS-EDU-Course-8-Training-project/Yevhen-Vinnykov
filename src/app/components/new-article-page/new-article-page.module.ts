import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewArticlePageRoutingModule } from './new-article-page-routing.module';
import { NewArticlePageComponent } from './new-article-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';



@NgModule({
  declarations: [
    NewArticlePageComponent
  ],
  imports: [
    CommonModule,
    NewArticlePageRoutingModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class NewArticlePageModule { }

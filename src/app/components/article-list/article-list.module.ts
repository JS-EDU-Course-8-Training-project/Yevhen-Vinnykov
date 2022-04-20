import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListComponent } from './article-list.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ArticleListComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatTabsModule
  ],
  exports: [ArticleListComponent],

})
export class ArticleListModule { }

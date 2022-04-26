import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewArticlePageRoutingModule } from './new-article-page-routing.module';
import { NewArticlePageComponent } from './new-article-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';



@NgModule({
  declarations: [
    NewArticlePageComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    NewArticlePageRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class NewArticlePageModule { }

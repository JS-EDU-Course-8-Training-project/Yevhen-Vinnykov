import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewArticlePageRoutingModule } from './new-article-page-routing.module';
import { NewArticlePageComponent } from './new-article-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { ConfirmationDialogModule } from 'src/app/components/confirmation-dialog/confirmation-dialog.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    NewArticlePageComponent,
  ],
  imports: [
    CommonModule,
    NewArticlePageRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    ConfirmationDialogModule,
    SharedModule,
  ]
})
export class NewArticlePageModule { }

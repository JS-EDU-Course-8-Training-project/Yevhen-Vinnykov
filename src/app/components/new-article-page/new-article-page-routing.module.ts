import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewArticlePageComponent } from './new-article-page.component';

const routes: Routes = [
  { path: '', component: NewArticlePageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewArticlePageRoutingModule { }

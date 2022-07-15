import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlePageComponent } from './article-page.component';
import { ArticleResolver } from './services/article-resolver.resolver';

const routes: Routes = [
  {
    path: '',
    component: ArticlePageComponent,
    resolve: { article: ArticleResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlePageRoutingModule {}

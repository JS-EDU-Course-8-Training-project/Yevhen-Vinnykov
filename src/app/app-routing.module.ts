import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'article/:slug',
    loadChildren: () => import('./pages/article-page/article-page.module').then(m => m.ArticlePageModule)
  },
  {
    path: 'create-article',
    loadChildren: () => import('./pages/new-article-page/new-article-page.module').then(m => m.NewArticlePageModule)
  },
  {
    path: 'edit-article/:slug',
    loadChildren: () => import('./pages/new-article-page/new-article-page.module').then(m => m.NewArticlePageModule)
  },
  {
    path: 'article/:slug',
    loadChildren: () => import('./pages/article-page/article-page.module').then(m => m.ArticlePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings-page/settings-page.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'user/:user-name',
    loadChildren: () => import('./pages/user-page/user-page.module').then(m => m.UserPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

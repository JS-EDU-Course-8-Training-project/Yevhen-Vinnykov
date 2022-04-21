import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlePageComponent } from './components/article-page/article-page.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'article/:slug', component: ArticlePageComponent },
  {
    path: 'create-article',
    loadChildren: () => import('./components/new-article-page/new-article-page.module').then(m => m.NewArticlePageModule) 
  },
  {
    path: 'edit-article/:slug',
    loadChildren: () => import('./components/new-article-page/new-article-page.module').then(m => m.NewArticlePageModule) 
  },
  {
    path: 'article/:slug',
    loadChildren: () => import('./components/article-page/article-page.module').then(m =>m.ArticlePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./components/settings-page/settings-page.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'user/:user-name',
    loadChildren: () => import('./components/user-page/user-page.module').then(m => m.UserPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

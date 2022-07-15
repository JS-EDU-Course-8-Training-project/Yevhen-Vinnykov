import { ConfirmationGuard } from '../../shared/guards/confirmation.guard';
import { AuthorizationGuard } from '../../shared/guards/authorization.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewArticlePageComponent } from './new-article-page.component';

const routes: Routes = [
  {
    path: '',
    component: NewArticlePageComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [ConfirmationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewArticlePageRoutingModule {}

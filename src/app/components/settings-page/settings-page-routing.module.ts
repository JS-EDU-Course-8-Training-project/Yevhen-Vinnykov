import { AuthorizationGuard } from './../../guards/authorization.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsPageComponent } from './settings-page.component';
import { ConfirmationGuard } from 'src/app/guards/confirmation.guard';

const routes: Routes = [
  {
    path: '',
    component: SettingsPageComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [ConfirmationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsPageRoutingModule { }

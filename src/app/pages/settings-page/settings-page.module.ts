import { NgModule } from '@angular/core';
import { ConfirmationDialogModule } from 'src/app/components/confirmation-dialog/confirmation-dialog.module';
import { SettingsPageRoutingModule } from './settings-page-routing.module';

import { SettingsPageComponent } from './settings-page.component';
import { SettingsFormComponent } from './settings-form/settings-form.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  declarations: [SettingsPageComponent, SettingsFormComponent],
  imports: [SettingsPageRoutingModule, ConfirmationDialogModule, SharedModule],
})
export class SettingsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmationDialogModule } from 'src/app/components/confirmation-dialog/confirmation-dialog.module';
import { SettingsPageRoutingModule } from './settings-page-routing.module';

import { SettingsPageComponent } from './settings-page.component';
import { SettingsFormComponent } from './settings-form/settings-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SettingsPageComponent, SettingsFormComponent],
  imports: [
    CommonModule,
    SettingsPageRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ConfirmationDialogModule,
    SharedModule,
  ],
})
export class SettingsPageModule {}

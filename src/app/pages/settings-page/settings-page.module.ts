import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsPageRoutingModule } from './settings-page-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsPageComponent } from './settings-page.component';
import { SettingsFormComponent } from './settings-form/settings-form.component';
import {MatButtonModule} from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmationDialogModule } from 'src/app/components/confirmation-dialog/confirmation-dialog.module';


@NgModule({
  declarations: [
    SettingsPageComponent,
    SettingsFormComponent

  ],
  imports: [
    CommonModule,
    SettingsPageRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ConfirmationDialogModule
  ]
})
export class SettingsPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsPageRoutingModule } from './settings-page-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsPageComponent } from './settings-page.component';
import { SettingsFormComponent } from './settings-form/settings-form.component';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    SettingsPageComponent,
    SettingsFormComponent

  ],
  imports: [
    CommonModule,
    SettingsPageRoutingModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class SettingsPageModule { }

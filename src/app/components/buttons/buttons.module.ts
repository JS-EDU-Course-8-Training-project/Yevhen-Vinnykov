import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteButtonComponent } from './delete-button/delete-button.component';
import { EditButtonComponent } from './edit-button/edit-button.component';
import { FollowButtonComponent } from './follow-button/follow-button.component';
import { LikeButtonComponent } from './like-button/like-button.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { SettingsButtonComponent } from './settings-button/settings-button.component';

@NgModule({
  declarations: [
    DeleteButtonComponent,
    EditButtonComponent,
    LikeButtonComponent,
    FollowButtonComponent,
    SettingsButtonComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [
    DeleteButtonComponent,
    EditButtonComponent,
    LikeButtonComponent,
    FollowButtonComponent,
    SettingsButtonComponent,
  ],
})
export class ButtonsModule {}

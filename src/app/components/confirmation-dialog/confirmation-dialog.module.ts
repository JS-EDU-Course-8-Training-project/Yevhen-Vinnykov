import { NgModule } from '@angular/core';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [SharedModule],
})
export class ConfirmationDialogModule {}

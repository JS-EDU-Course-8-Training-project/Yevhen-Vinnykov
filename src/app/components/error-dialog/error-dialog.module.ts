import { NgModule } from '@angular/core';
import { ErrorDialogComponent } from './error-dialog.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  declarations: [ErrorDialogComponent],
  imports: [SharedModule],
})
export class ErrorDialogModule {}

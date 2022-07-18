import { SignUpRoutingModule } from './sign-up-routing.module';
import { NgModule } from '@angular/core';
import { SignUpComponent } from './sign-up.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  declarations: [SignUpComponent],
  imports: [SignUpRoutingModule, SharedModule],
})
export class SignUpModule {}

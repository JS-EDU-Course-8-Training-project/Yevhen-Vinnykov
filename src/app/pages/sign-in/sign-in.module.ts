import { SignInRoutingModule } from './sign-in-routing.module';
import { NgModule } from '@angular/core';
import { SignInComponent } from './sign-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
  declarations: [SignInComponent],
  imports: [SignInRoutingModule, BrowserAnimationsModule, SharedModule],
})
export class SignInModule {}

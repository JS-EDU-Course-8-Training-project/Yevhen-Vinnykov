import { MatButtonModule } from '@angular/material/button';
import { SignUpRoutingModule } from './sign-app-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [SignUpComponent],
  imports: [
    CommonModule,
    SignUpRoutingModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class SignUpModule { }

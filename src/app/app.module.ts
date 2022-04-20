import { SignUpModule } from './components/sign-up/sign-up.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ButtonComponent } from './components/button/button.component';
import { MatButtonModule } from '@angular/material/button';
import { SignInModule } from './components/sign-in/sign-in.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BannerModule } from './components/banner/banner.module';
import { HomeModule } from './components/home/home.module';
import { ArticleListModule } from './components/article-list/article-list.module';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    ButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatButtonModule,
    SignUpModule,
    SignInModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BannerModule,
    HomeModule,
    ArticleListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

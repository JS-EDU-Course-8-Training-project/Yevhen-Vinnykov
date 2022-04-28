import { MatDialogModule } from '@angular/material/dialog';
import { SignUpModule } from './pages/sign-up/sign-up.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { SignInModule } from './pages/sign-in/sign-in.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BannerModule } from './components/banner/banner.module';
import { HomeModule } from './pages/home/home.module';
import { ArticleListModule } from './components/article-list/article-list.module';
import { AuthorizationInterceptor } from './shared/interceptors/authorization.interceptor';
import { NavbarUserComponent } from './components/navbar/navbar-user/navbar-user.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    NavbarUserComponent,
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
    ArticleListModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

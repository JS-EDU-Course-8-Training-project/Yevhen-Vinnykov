import { SignUpModule } from './components/sign-up/sign-up.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ButtonComponent } from './components/button/button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ArticlePageComponent } from './components/article-page/article-page.component';
import { BannerComponent } from './components/banner/banner.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { SignInModule } from './components/sign-in/sign-in.module';
import { YourFeedComponent } from './components/home/your-feed/your-feed.component';
import { GlobalFeedComponent } from './components/home/global-feed/global-feed.component';
import { TaggedArticlesComponent } from './components/home/tagged-articles/tagged-articles.component';
import { TagsComponent } from './components/home/tags/tags.component';
import { CommentFormComponent } from './components/article-page/comment-form/comment-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    NavbarComponent,
    ButtonComponent,
    ArticleListComponent,
    ArticlePageComponent,
    BannerComponent,
    YourFeedComponent,
    GlobalFeedComponent,
    TaggedArticlesComponent,
    TagsComponent,
    CommentFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    SignUpModule,
    SignInModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

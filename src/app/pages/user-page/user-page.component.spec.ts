import { IArticleResponse } from 'src/app/shared/models/IArticle';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageComponent } from './user-page.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestAttributeDirective } from 'src/app/shared/tests/test-attribute.directive';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

class RouterMock {
  public url = 'localhost:4200/user/test-username';
  public events = of(NavigationEnd);
}

class RouteMock {
  public snapshot = { params: { 'user-name': 'John' } };
}

const dataMock: IArticleResponse = {
  articles: [
    {
      id: '1',
      slug: 'test-slug',
      title: 'test-title',
      description: 'test-description',
      body: 'test-body',
      image: 'test-image',
      tagList: ['test-tag'],
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      favorited: false,
      favoritesCount: 2,
      author: {
        username: 'test-author',
        bio: 'test-bio',
        image: 'test-image',
        following: false,
      },
    },
  ],
  articlesCount: 10,
};

class ArticlesServiceMock {
  public fetchUserArticles = () => new Promise((resolve) => resolve(dataMock));
  public fetchFavoritedArticles = () =>
    new Promise((resolve) => resolve(dataMock));
}

describe('USER PAGE COMPONENT', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPageComponent, TestAttributeDirective],
      imports: [MatSnackBarModule],
      providers: [
        { provide: Router, useClass: RouterMock },
        { provide: ActivatedRoute, useClass: RouteMock },
        { provide: ArticlesService, useClass: ArticlesServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

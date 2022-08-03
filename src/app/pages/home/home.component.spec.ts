import { IArticleResponse } from './../../shared/models/IArticle';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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

class AuthServiceMock {
  public isAuthorized$ = { getValue: () => true };
}

class ArticlesServiceMock {
  public fetchArticles = () => new Promise((resolve) => resolve(dataMock));
  public fetchFollowedArticles = () =>
    new Promise((resolve) => resolve(dataMock));
  public fetchArticlesByTag = () => new Promise((resolve) => resolve(dataMock));
}

describe('HOME COMPONENT', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [MatSnackBarModule],
      providers: [
        { provide: AuthorizationService, useClass: AuthServiceMock },
        { provide: ArticlesService, useClass: ArticlesServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should set tab index to 2 and set selected tag', () => {
    const spy = spyOn(component, 'handleTabChange').and.callThrough();

    component.handleSelectTag('test');

    expect(component.tabIndex).toBe(2);
    expect(component.selectedTag).toBe('test');
    expect(spy).toHaveBeenCalledOnceWith(2);
  });

  it('should set tab index to 1 and set tag to empty string', () => {
    component.handleTabChange(1);

    expect(component.tabIndex).toBe(1);
    expect(component.selectedTag).toBe('');
  });
});

import { AuthorizationService } from '../../shared/services/authorization/authorization.service';
import { RedirectionService } from '../../shared/services/redirection/redirection.service';
import { ArticlesService } from '../../shared/services/articles/articles.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ArticleCardComponent } from './article-card.component';
import { IArticle } from '../../shared/models/IArticle';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

const articleMock: IArticle = {
  id: '1',
  slug: 'test-slug',
  title: '',
  description: '',
  body: '',
  image: '',
  tagList: [],
  createdAt: '',
  updatedAt: '',
  favorited: false,
  favoritesCount: 2,
  author: {
    username: 'test',
    bio: 'test-bio',
    image: '',
    following: false,
  },
};

class AricleServiceMock {
  public addToFavorites = () =>
    Promise.resolve({
      ...articleMock,
      favorited: true,
      favoritesCount: articleMock.favoritesCount + 1,
    });

  public removeFromFavorites = () =>
    Promise.resolve({
      ...articleMock,
      favorited: false,
      favoritesCount: articleMock.favoritesCount - 1,
    });
}

class RedirectionServiceMock {
  public redirectUnauthorized = () =>
    new Promise<boolean>((resolve) => resolve(true));
}

class AuthorizationServiceAuthorizedMock {
  public isAuthorized$ = { getValue: () => true };
}

class AuthorizationServiceNotAuthorizedMock {
  public isAuthorized$ = { getValue: () => false };
}

describe('ARTICLE CARD COMPONENT', () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArticleCardComponent,
        MatIcon,
        MatCard,
        ErrorDialogComponent,
      ],
      imports: [MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { data: { error: 'Something went wrong :(' } },
        },
        { provide: ArticlesService, useClass: AricleServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
        {
          provide: AuthorizationService,
          useClass: AuthorizationServiceAuthorizedMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;
  });

  it('should initialize correctly', async () => {
    const inputArticle: IArticle = articleMock;
    component.article = inputArticle;
    fixture.detectChanges();
    expect(component.likesCount).toBe(articleMock.favoritesCount);
  });

  it('dislike() should be invoked on button click and dislike', waitForAsync(() => {
    const inputArticle: IArticle = { ...articleMock, favorited: true };
    component.article = inputArticle;
    fixture.detectChanges();

    const spy = spyOn(component, 'dislike').and.callThrough();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.likesCount).toBe(1);
      expect(component.isLiked).toBe(false);
      expect(spy).toHaveBeenCalledWith(inputArticle.slug);
    });
  }));

  it('like() should be invoked on button click and like', waitForAsync(() => {
    const inputArticle: IArticle = { ...articleMock, favorited: false };
    component.article = inputArticle;
    fixture.detectChanges();

    const spy = spyOn(component, 'like').and.callThrough();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.likesCount).toBe(3);
      expect(component.isLiked).toBe(true);
      expect(spy).toHaveBeenCalledWith(inputArticle.slug);
    });
  }));
});

describe('ARTICLE CARD COMPONENT > UNAUTHORIZED', () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArticleCardComponent,
        MatIcon,
        MatCard,
        ErrorDialogComponent,
      ],
      imports: [MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { data: { error: 'Something went wrong :(' } },
        },
        { provide: ArticlesService, useClass: AricleServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
        {
          provide: AuthorizationService,
          useClass: AuthorizationServiceNotAuthorizedMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;
    component.article = articleMock;
    fixture.detectChanges();
  });

  it('should not like because unothorized', waitForAsync(() => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.likesCount).toBe(articleMock.favoritesCount);
      expect(component.isLiked).toBe(articleMock.favorited);
    });
  }));
});

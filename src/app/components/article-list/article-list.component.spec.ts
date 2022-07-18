import { AuthorizationService } from './../../shared/services/authorization/authorization.service';
import { RedirectionService } from './../../shared/services/redirection/redirection.service';
import { ArticlesService } from './../../shared/services/articles/articles.service';
import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ArticleListComponent } from './article-list.component';
import { IArticle } from './../../shared/models/IArticle';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

const article: IArticle = {
  id: '1',
  slug: 'test-slug',
  title: '',
  description: '',
  body: '',
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
    of({
      ...article,
      favorited: true,
      favoritesCount: article.favoritesCount + 1,
    });

  public removeFromFavorites = () =>
    of({
      ...article,
      favorited: false,
      favoritesCount: article.favoritesCount - 1,
    });
}

class RedirectionServiceMock {
  public redirectUnauthorized = () =>
    new Promise<boolean>((resolve) => resolve(true));
}

class AuthorizationServiceAuthorizedMock {
  public isAuthorized$ = of(true);
}

class AuthorizationServiceNotAuthorizedMock {
  public isAuthorized$ = of(false);
}

describe('ARTICLE COMPONENT', () => {
  let component: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArticleListComponent,
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
    fixture = TestBed.createComponent(ArticleListComponent);
    component = fixture.componentInstance;
    const inputArticle: IArticle = article;
    component.article = inputArticle;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', async () => {
    expect(component.likesCount).toBe(2);
  });
});

describe('ARTICLE COMPONENT > HANDLE LIKE DISLIKE METHOD > AUTHORIZED', () => {
  let component: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArticleListComponent,
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
    fixture = TestBed.createComponent(ArticleListComponent);
    component = fixture.componentInstance;
  });

  it('should be invoked on button click and dislike', waitForAsync(() => {
    const inputArticle: IArticle = { ...article, favorited: true };
    component.article = inputArticle;
    fixture.detectChanges();

    const spy = spyOn<any>(component, 'likeHandler').and.callThrough();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.likesCount).toBe(1);
      expect(component.isLiked).toBe(false);
      expect(spy).toHaveBeenCalledWith('test-slug', 'removeFromFavorites');
    });
  }));

  it('should be invoked on button click and like', waitForAsync(() => {
    const inputArticle: IArticle = { ...article, favorited: false };
    component.article = inputArticle;
    fixture.detectChanges();

    const spy = spyOn<any>(component, 'likeHandler').and.callThrough();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.likesCount).toBe(3);
      expect(component.isLiked).toBe(true);
      expect(spy).toHaveBeenCalledWith('test-slug', 'addToFavorites');
    });
  }));
});

describe('ARTICLE COMPONENT > HANDLE LIKE DISLIKE METHOD > UNAUTHORIZED', () => {
  let component: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArticleListComponent,
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
    fixture = TestBed.createComponent(ArticleListComponent);
    component = fixture.componentInstance;
  });

  it('should not be invoked on button because unauthorized', waitForAsync(() => {
    const inputArticle: IArticle = { ...article };
    component.article = inputArticle;

    const spy = spyOn<any>(component, 'likeHandler').and.callThrough();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.likesCount).toBe(2);
      expect(component.isLiked).toBe(false);
      expect(spy).not.toHaveBeenCalled();
    });
  }));
});

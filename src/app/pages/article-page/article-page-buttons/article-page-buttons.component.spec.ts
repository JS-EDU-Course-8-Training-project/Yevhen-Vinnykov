import { MatCardModule } from '@angular/material/card';
import { ProfilesService } from './../../../shared/services/profiles/profiles.service';
import { IArticle } from './../../../shared/models/IArticle';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArticlePageButtonsComponent } from './article-page-buttons.component';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { ArticlePageButtonsService } from '../services/buttons/article-page-buttons.service';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ArticlesServiceMock,
  ProfilesServiceMock,
  RedirectionServiceMock,
  ArticlePageButtonsServiceMock,
  AuthorizationServiceMock,
  article,
  authUser,
  AuthorizationServiceNotAuthMock
} from './buttons.mocks.spec';


describe('ArticlePageButtonsComponent', () => {
  let component: ArticlePageButtonsComponent;
  let fixture: ComponentFixture<ArticlePageButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticlePageButtonsComponent],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock },
        { provide: ProfilesService, useClass: ProfilesServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
        { provide: ArticlePageButtonsService, useClass: ArticlePageButtonsServiceMock },
        { provide: AuthorizationService, useClass: AuthorizationServiceMock },
      ],
      imports: [MatCardModule, MatIconModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePageButtonsComponent);
    component = fixture.componentInstance;
    component.article = article;
    component.slug = 'test-slug';
    component.authUser = authUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialize method', () => {

    beforeEach(() => {
      component.article = article;
      component.slug = 'test-slug';
      component.authUser = authUser;
      fixture.detectChanges();
    });

    it('should initialize', () => {
      const spy = spyOn<any>(component, 'initialize')
      component.ngOnChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('HandleLikeDislike method', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should be invoked on button click and dislike', waitForAsync(() => {
      const inputArticle: IArticle = { ...article, favorited: true };
      component.article = inputArticle;
      component.ngOnChanges();
      const spy = spyOn<any>(component, 'likeHandler').and.callThrough();
      const buttonElement = fixture.debugElement.query(By.css('[data-angular="test-like-btn"]'));
      buttonElement.triggerEventHandler('click', null);
      fixture.whenStable().then(() => {
        expect(component.likesCount).toBe(1);
        expect(component.isLiked).toBe(false);
        expect(spy).toHaveBeenCalledWith('test-slug', 'removeFromFavorites');
      });
    }));

    it('should be invoked on button click and like', waitForAsync(() => {
      const inputArticle: IArticle = { ...article, favorited: false };
      component.article = inputArticle;
      component.ngOnChanges();
      const spy = spyOn<any>(component, 'likeHandler').and.callThrough();
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('[data-angular="test-like-btn"]'));
      buttonElement.triggerEventHandler('click', null);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.likesCount).toBe(3);
        expect(component.isLiked).toBe(true);
        expect(spy).toHaveBeenCalledWith('test-slug', 'addToFavorites');
      });
    }));

  });

  describe('HandleFollowUnfollow method', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should be invoked on button click and unfollow', waitForAsync(() => {
      const inputArticle: IArticle = { ...article, author: { ...article.author, following: true } };
      component.article = inputArticle;
      component.ngOnChanges();
      const spy = spyOn<any>(component, 'followingHandler').and.callThrough();
      const buttonElement = fixture.debugElement.query(By.css('[data-angular="test-follow-btn"]'));
      buttonElement.triggerEventHandler('click', null);
      fixture.whenStable().then(() => {
        expect(component.isFollowed).toBe(false);
        expect(spy).toHaveBeenCalledWith('test', 'unfollow');
      });
    }));

    it('should be invoked on button click and follow', waitForAsync(() => {
      const inputArticle: IArticle = { ...article, author: { ...article.author, following: false } };
      component.article = inputArticle;
      component.ngOnChanges();
      const spy = spyOn<any>(component, 'followingHandler').and.callThrough();
      const buttonElement = fixture.debugElement.query(By.css('[data-angular="test-follow-btn"]'));
      buttonElement.triggerEventHandler('click', null);
      fixture.whenStable().then(() => {
        expect(component.isFollowed).toBe(true);
        expect(spy).toHaveBeenCalledWith('test', 'follow');
      });
    }));
  });


  describe('Delete method', () => {

    beforeEach(() => {
      component.article = { ...article, author: { ...article.author, username: 'test-username' } };
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should delete the article', waitForAsync(() => {
      const spy = spyOn(component, 'deleteArticle').and.callThrough();
      const buttonElement = fixture.debugElement.query(By.css('[data-angular="test-delete-btn"]'));
      buttonElement.triggerEventHandler('click', null);
      fixture.whenStable().then(() => {
        expect(spy).toHaveBeenCalledWith('test-slug');
      });
    }));

  });

  describe('EditRedirection method', () => {

    beforeEach(() => {
      component.article = { ...article, author: { ...article.author, username: 'test-username' } };
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should redirect to edit page', waitForAsync(() => {
      const spy = spyOn(component, 'redirectToEditArticle').and.callThrough();
      const buttonElement = fixture.debugElement.query(By.css('[data-angular="test-edit-btn"]'));
      buttonElement.triggerEventHandler('click', null);
      fixture.whenStable().then(() => {
        expect(spy).toHaveBeenCalledWith('test-slug');
      });
    }));

  });

});

describe('ArticlePageButtonsComponent', () => {
  let component: ArticlePageButtonsComponent;
  let fixture: ComponentFixture<ArticlePageButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticlePageButtonsComponent],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock },
        { provide: ProfilesService, useClass: ProfilesServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
        { provide: ArticlePageButtonsService, useClass: ArticlePageButtonsServiceMock },
        { provide: AuthorizationService, useClass: AuthorizationServiceNotAuthMock },
      ],
      imports: [MatCardModule, MatIconModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePageButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('button clicks should trigger redirection to sign-in when unauthorized', () => {
    const service = TestBed.inject(RedirectionService);
    const spy = spyOn(service, 'redirectUnauthorized');
    const likeButton = fixture.debugElement.query(By.css('[data-angular="test-like-btn"]'));
    likeButton.triggerEventHandler('click', null);
    const followButton = fixture.debugElement.query(By.css('[data-angular="test-follow-btn"]'));
    followButton.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalledTimes(2);
  });

});
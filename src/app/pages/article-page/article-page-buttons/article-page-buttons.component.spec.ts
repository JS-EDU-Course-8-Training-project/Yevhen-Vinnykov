import { MatCardModule } from '@angular/material/card';
import { IExistingUser } from './../../../shared/models/IExistingUser';
import { ProfilesService } from './../../../shared/services/profiles/profiles.service';
import { IArticle } from './../../../shared/models/IArticle';
import { of, BehaviorSubject } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArticlePageButtonsComponent } from './article-page-buttons.component';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { ArticlePageButtonsService } from '../services/buttons/article-page-buttons.service';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

interface IButtonsState {
  favoriteInProgress: boolean;
  followingInProgress: boolean;
  isLiked: boolean;
  isFollowed: boolean;
  likesCount: number;
}

class ArticlesServiceMock {
  public addToFavorites = (slug: string) => of(
    { ...article, favorited: true, favoritesCount: article.favoritesCount + 1 });

  public removeFromFavorites = (slug: string) => of(
    { ...article, favorited: false, favoritesCount: article.favoritesCount - 1 });

  public deleteArticle = (slug: string) => of(null);
}

class ProfilesServiceMock {
  public follow = (username: string) => of({ following: true });

  public unfollow = (username: string) => of({ following: false });
}

class RedirectionServiceMock {
  public redirectToEditArticle = () => new Promise<boolean>((resolve, reject) => resolve(true));

  public redirectUnauthorized = () => new Promise<boolean>((resolve, reject) => resolve(true));

  public redirectHome = () => new Promise<boolean>((resolve, reject) => resolve(true));
}

class ArticlePageButtonsServiceMock {
  public ButtonsState$: BehaviorSubject<IButtonsState> = new BehaviorSubject<IButtonsState>({
    favoriteInProgress: false,
    followingInProgress: false,
    isLiked: false,
    isFollowed: false,
    likesCount: 0
  });

  public createInitialState = (article: IArticle): IButtonsState => {
    return {
      followingInProgress: false,
      favoriteInProgress: false,
      isLiked: article.favorited,
      isFollowed: article.author.following,
      likesCount: article.favoritesCount
    };
  }

  public initialize(article: IArticle): BehaviorSubject<IButtonsState> {
    this.ButtonsState$.next(this.createInitialState(article));
    return this.ButtonsState$;
  }

  public updateState(field: string, value: number | boolean): void {
    this.ButtonsState$.next({ ...this.ButtonsState$.getValue(), [field]: value });
  }
}

class AuthorizationServiceMock {
  public isAuthorized$ = of(true);

  public checkIfAuthorized = () => of(true);
}

class AuthorizationServiceNotAuthMock {
  public isAuthorized$ = of(false);

  public checkIfAuthorized = () => of(false);
}


const article: IArticle = {
  slug: 'test-slug',
  title: 'test-tile',
  description: 'test-description',
  body: 'test-body',
  tagList: ['test-tag'],
  createdAt: Date.now().toLocaleString(),
  updatedAt: Date.now().toLocaleString(),
  favorited: false,
  favoritesCount: 2,
  author: {
    username: 'test',
    bio: 'test-bio',
    image: 'test-author',
    following: false,
  }
};

const authUser: IExistingUser = {
  email: 'test@example.com',
  username: 'test-username',
  bio: 'test-bio',
  image: 'test-image',
  token: 'test-token',
  password: 'test-password'
};


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
        { provide: AuthorizationService, useClass: AuthorizationServiceMock }
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialize method', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(ArticlePageButtonsComponent);
      component = fixture.componentInstance;
      component.article = article;
      component.slug = 'test';
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
      fixture = TestBed.createComponent(ArticlePageButtonsComponent);
      component = fixture.componentInstance;
      component.article = article;
      component.slug = 'test-slug';
      component.authUser = authUser;
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
      fixture = TestBed.createComponent(ArticlePageButtonsComponent);
      component = fixture.componentInstance;
      component.article = article;
      component.slug = 'test-slug';
      component.authUser = authUser;
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
      fixture = TestBed.createComponent(ArticlePageButtonsComponent);
      component = fixture.componentInstance;
      component.article = { ...article, author: { ...article.author, username: 'test-username' } };
      component.slug = 'test-slug';
      component.authUser = authUser;
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
      fixture = TestBed.createComponent(ArticlePageButtonsComponent);
      component = fixture.componentInstance;
      component.article = { ...article, author: { ...article.author, username: 'test-username' } };
      component.slug = 'test-slug';
      component.authUser = authUser;
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

describe('Unauthorized Redirection', () => {
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
        { provide: AuthorizationService, useClass: AuthorizationServiceNotAuthMock }
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

  it('should invoke redirectToEditArticle', () => {
    const likeButton = fixture.debugElement.query(By.css('[data-angular="test-like-btn"]'));
    likeButton.triggerEventHandler('click', null);
    const followButton = fixture.debugElement.query(By.css('[data-angular="test-follow-btn"]'));
    followButton.triggerEventHandler('click', null);
    fixture.detectChanges();
  });

});
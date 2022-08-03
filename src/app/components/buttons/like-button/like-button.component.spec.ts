import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { IArticle } from 'src/app/shared/models/IArticle';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';

import { LikeButtonComponent } from './like-button.component';
import { LikeButtonStore } from './like-button.store';

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
  favoritesCount: 1,
  author: {
    username: 'test',
    bio: 'test-bio',
    image: '',
    following: false,
  },
};

class RedirectionServiceMock {
  public redirectUnauthorized = () =>
    new Promise<boolean>((resolve) => resolve(true));
}

class ArticlesServiceMock {
  public addToFavorites = () =>
    new Promise((resolve) => resolve({ favorited: true, favoritesCount: 1 }));
  public removeFromFavorites = () =>
    new Promise((resolve) => resolve({ favorited: false, favoritesCount: 0 }));
}

class LikeButtonStoreMock {
  public isLoading$ = new BehaviorSubject<boolean>(false);
  public isLiked$ = new BehaviorSubject<boolean>(false);
  public likesCount$ = new BehaviorSubject<number>(0);
}

describe('LIKE BUTTON COMPONENT', () => {
  let component: LikeButtonComponent;
  let fixture: ComponentFixture<LikeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LikeButtonComponent],
      providers: [
        { provide: RedirectionService, useClass: RedirectionServiceMock },
        { provide: ArticlesService, useClass: ArticlesServiceMock },
        { provide: LikeButtonStore, useClass: LikeButtonStoreMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeButtonComponent);
    component = fixture.componentInstance;
    component.isAuth = true;
  });

  it('like() should be invoked on click and like', () => {
    component.article = articleMock;
    fixture.detectChanges();

    const spy = spyOn(component, 'like').and.callThrough();

    const likeButton = fixture.debugElement.query(By.css('button'));
    likeButton.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalled();
  });

  it('dislike() should be invoked on click and dislike', () => {
    component.article = { ...articleMock, favorited: true };
    fixture.detectChanges();

    const spy = spyOn(component, 'dislike').and.callThrough();

    const likeButton = fixture.debugElement.query(By.css('button'));
    likeButton.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalled();
  });

  it('should not like when unauthorized', () => {
    component.article = articleMock;
    component.isAuth = false;
    fixture.detectChanges();

    const likeButton = fixture.debugElement.query(By.css('button'));
    likeButton.triggerEventHandler('click', null);

    expect(component.store.likesCount$.getValue()).toBe(1);
  });
});

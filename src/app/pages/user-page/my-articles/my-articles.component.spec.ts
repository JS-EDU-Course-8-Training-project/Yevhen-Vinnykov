import { IArticleResponse } from 'src/app/shared/models/IArticle';
import { of, throwError, catchError } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyArticlesComponent } from './my-articles.component';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const expectedData: IArticleResponse = {
  articles: [
    {
      id: '1',
      slug: 'test-slug',
      title: 'test-title',
      description: 'test-description',
      body: 'test-body',
      tagList: ['test-tag'],
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      favorited: false,
      favoritesCount: 2,
      author: {
        username: 'test-author',
        bio: 'test-bio',
        image: 'test-image',
        following: true,
      },
    },
  ],
  articlesCount: 10,
};

class ArticlesServiceMock {
  public fetchUserArticles = () => of(expectedData);
}

class ArticlesServiceMockWithError {
  public fetchUserArticles = () =>
    throwError(() => Error('Fetching articles failed'));
}

describe('MY ARTICLES COMPONENT', () => {
  let component: MyArticlesComponent;
  let fixture: ComponentFixture<MyArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyArticlesComponent],
      providers: [{ provide: ArticlesService, useClass: ArticlesServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyArticlesComponent);
    component = fixture.componentInstance;
    component.username = 'test-username';
    component.tabIndex = 0;
    fixture.detectChanges();
  });

  it('getArticles should be called', () => {
    const spy = spyOn<any>(component, 'getArticles').and.callThrough();

    component.ngOnChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('getArticles should not be called', () => {
    const spy = spyOn<any>(component, 'getArticles').and.callThrough();

    component.tabIndex = 1;
    component.ngOnChanges();

    expect(spy).not.toHaveBeenCalled();
  });

  it('setData should be called', () => {
    const spy = spyOn<any>(component, 'setData').and.callThrough();

    component.ngOnChanges();

    expect(spy).toHaveBeenCalledWith(expectedData);
    expect(component.myArticles).toEqual(expectedData.articles);
  });
});

describe('ON CATCH ERROR METHOD', () => {
  let component: MyArticlesComponent;
  let fixture: ComponentFixture<MyArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyArticlesComponent],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMockWithError },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyArticlesComponent);
    component = fixture.componentInstance;
    component.username = 'test-username';
    component.tabIndex = 0;
    fixture.detectChanges();
    component.ngOnChanges();
  });

  it('onCatchError should be called', waitForAsync(() => {
    const service = TestBed.inject(ArticlesService);

    service.fetchUserArticles('test-username').pipe(
      catchError((): any => {
        expect(component.error).toBe('Something went wrong :(');
        return of({} as IArticleResponse);
      })
    );
  }));
});

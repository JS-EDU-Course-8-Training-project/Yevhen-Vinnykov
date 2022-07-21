import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/infinite-scroll.service';
import { ArticlesService } from './../../../shared/services/articles/articles.service';
import { IArticleResponse } from './../../../shared/models/IArticle';
import { of, throwError, catchError } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { YourFeedComponent } from './your-feed.component';
import { NO_ERRORS_SCHEMA, QueryList, ElementRef } from '@angular/core';

const expectedData: IArticleResponse = {
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
        following: true,
      },
    },
  ],
  articlesCount: 10,
};

class ArticlesServiceMock {
  public fetchFollowedArticles = () => of(expectedData);
}

class ArticlesServiceMockWithError {
  public fetchFollowedArticles = () =>
    throwError(() => new Error('Fetching articles failed'));
}

class InfiniteScrollServiceMock {
  public observeIntersection = () => of([]);
  public observer = { observe: () => ({}) };
}

describe('YOUR FEED COMPONENT', () => {
  describe('WHEN NO ERROR IS THROWN', () => {
    let component: YourFeedComponent;
    let fixture: ComponentFixture<YourFeedComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [YourFeedComponent],
        providers: [
          { provide: ArticlesService, useClass: ArticlesServiceMock },
          {
            provide: InfiniteScrollService,
            useClass: InfiniteScrollServiceMock,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(YourFeedComponent);
      component = fixture.componentInstance;
      component.tabIndex = 0;
      component.lastItem = new QueryList<ElementRef<any>>();
      fixture.detectChanges();
      component.ngOnChanges();
    });

    it('getFollowedArticles should be called', waitForAsync(() => {
      const service = TestBed.inject(ArticlesService);

      service.fetchFollowedArticles().subscribe((data: IArticleResponse) => {
        expect(data.articles).toEqual(expectedData.articles);
      });
    }));
  });

  describe('WHEN ERROR IS THROWN', () => {
    let component: YourFeedComponent;
    let fixture: ComponentFixture<YourFeedComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [YourFeedComponent],
        providers: [
          { provide: ArticlesService, useClass: ArticlesServiceMockWithError },
          {
            provide: InfiniteScrollService,
            useClass: InfiniteScrollServiceMock,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(YourFeedComponent);
      component = fixture.componentInstance;
      component.tabIndex = 0;
      component.lastItem = new QueryList<ElementRef<any>>();
      fixture.detectChanges();
      component.ngOnChanges();
    });

    it('onCatchError should be called', waitForAsync(() => {
      const service = TestBed.inject(ArticlesService);

      service.fetchFollowedArticles().pipe(
        catchError(() => {
          expect(component.error).toBe('Something went wrong :(');
          return of({ articles: [], articlesCount: 0 });
        })
      );
    }));
  });
});

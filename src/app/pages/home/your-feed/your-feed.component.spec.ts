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
      }
    },
  ],
  articlesCount: 10
};

class ArticlesServiceMock {
  public fetchFollowedArticles = (tag: string, offset: number, limit: number) => of(expectedData);
}

class ArticlesServiceMockWithError {
  public fetchFollowedArticles = (offset: number, limit: number) => throwError(() => new Error('Fetching articles failed'));
}


class InfiniteScrollServiceMock {
  public observeIntersection = () => of([]);
  public observer = { observe: () => {} };
}

describe('YourFeedComponent', () => {

  describe('When no error thrown', () => {
    let component: YourFeedComponent;
    let fixture: ComponentFixture<YourFeedComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [YourFeedComponent],
        providers: [
          { provide: ArticlesService, useClass: ArticlesServiceMock },
          { provide: InfiniteScrollService, useClass: InfiniteScrollServiceMock }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(YourFeedComponent);
      component = fixture.componentInstance;
      component.tabIndex = 0;
      component.lastItem = new QueryList<ElementRef<any>>();
      fixture.detectChanges();
      component.ngOnChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('getFollowedArticles should be called', waitForAsync(() => {
      const service = TestBed.inject(ArticlesService);
      service.fetchFollowedArticles().subscribe((data: IArticleResponse) => {
        expect(data.articles).toEqual(expectedData.articles);
      });
    }));
  });


  describe('When errorn thrown', () => {
    let component: YourFeedComponent;
    let fixture: ComponentFixture<YourFeedComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [YourFeedComponent],
        providers: [
          { provide: ArticlesService, useClass: ArticlesServiceMockWithError },
          { provide: InfiniteScrollService, useClass: InfiniteScrollServiceMock }

        ],
        schemas: [NO_ERRORS_SCHEMA]

      })
        .compileComponents();
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
          expect(component.error).toBe('Something went wrong :(')
          return of({ articles: [], articlesCount: 0 });
        }));
    }));

  });

});

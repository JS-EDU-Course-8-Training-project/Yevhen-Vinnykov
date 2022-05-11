import { HttpErrorResponse } from '@angular/common/http';
import { ArticlesService } from './../../../shared/services/articles/articles.service';
import { IArticleResponse } from './../../../shared/models/IArticle';
import {catchError, of, throwError} from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalFeedComponent } from './global-feed.component';
import {InfiniteScrollService} from "../../../shared/services/infinite-scroll/infinite-scroll.service";
import {ElementRef, NO_ERRORS_SCHEMA, QueryList} from "@angular/core";

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
        following: false,
      }
    },
  ],
  articlesCount: 10
};


class ArticlesServiceMock {
  public fetchArticles = (offset: number, limit: number) => of(expectedData);
}

class ArticlesServiceMockWithError {
  public fetchArticles = (offset: number, limit: number) => throwError(() => HttpErrorResponse);
}

class InfiniteScrollServiceMock {
  public observeIntersection = () => of([]);
  public observer = { observe: () => {} };
}

describe('GlobalFeedComponent', () => {
  describe('When no error thrown', () => {
    let component: GlobalFeedComponent;
    let fixture: ComponentFixture<GlobalFeedComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [GlobalFeedComponent],
        providers: [
          { provide: ArticlesService, useClass: ArticlesServiceMock },
          { provide: InfiniteScrollService, useClass: InfiniteScrollServiceMock }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(GlobalFeedComponent);
      component = fixture.componentInstance;
      component.tabIndex = 1;
      component.isAuthorized = true;
      fixture.detectChanges();
      component.ngOnChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('setDataOnResponse should be called because tabIndex is 1', waitForAsync(() => {
      const service = TestBed.inject(ArticlesService);
      service.fetchArticles().subscribe((data: IArticleResponse) => {
        expect(data.articles).toEqual(expectedData.articles);
      })
    }));

    it('setDataOnResponse should be called because is Authorized is false', waitForAsync(() => {
      component.isAuthorized = false;
      component.tabIndex = 0;
      const service = TestBed.inject(ArticlesService);
      service.fetchArticles().subscribe((data: IArticleResponse) => {
        expect(data.articles).toEqual(expectedData.articles);
      })
    }));

  });


  describe('When throw error', () => {
    let component: GlobalFeedComponent;
    let fixture: ComponentFixture<GlobalFeedComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [GlobalFeedComponent],
        providers: [
          { provide: ArticlesService, useClass: ArticlesServiceMockWithError },
          { provide: InfiniteScrollService, useClass: InfiniteScrollServiceMock }

        ],
        schemas: [NO_ERRORS_SCHEMA]

      })
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(GlobalFeedComponent);
      component = fixture.componentInstance;
      component.tabIndex = 1;
      component.isAuthorized = false;
      component.lastItem = new QueryList<ElementRef<any>>();
      fixture.detectChanges();
      component.ngOnChanges();
    });

    it('onCatchError should be called', waitForAsync(() => {
      const service = TestBed.inject(ArticlesService);
      service.fetchArticles().pipe(
        catchError(() => {
          expect(component.error).toBe('Something went wrong :(')
          return of('')
        })
      )
    }));
  });
});

import { InfiniteScrollService } from 'src/app/shared/services/infinite-scroll/infinite-scroll.service';
import { ArticlesService } from './../../../shared/services/articles/articles.service';
import { of, throwError, catchError } from 'rxjs';
import { IArticleResponse } from './../../../shared/models/IArticle';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaggedArticlesComponent } from './tagged-articles.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, QueryList, ElementRef } from '@angular/core';

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
  public fetchArticlesByTag = (tag: string, offset: number, limit: number) => of(expectedData);
}

class ArticlesServiceMockWithError {
  public fetchArticlesByTag = (tag: string, offset: number, limit: number) => throwError(() => new Error('Failed'));
}

class InfiniteScrollServiceMock {
  public observeIntersection = () => of([]);
  public observer = { observe: () => {} };
}

describe('TaggedArticlesComponent', () => {

  describe('When no error thrown', () => {
    let component: TaggedArticlesComponent;
    let fixture: ComponentFixture<TaggedArticlesComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [TaggedArticlesComponent],
        providers: [
          { provide: ArticlesService, useClass: ArticlesServiceMock },
          { provide: InfiniteScrollService, useClass: InfiniteScrollServiceMock}
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(TaggedArticlesComponent);
      component = fixture.componentInstance;
      component.selectedTag = 'test';
      component.lastItem = new QueryList<ElementRef<any>>();
      component.tabIndex = 2;
      fixture.detectChanges();
      component.ngOnChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('setDataOnResponse should be called', waitForAsync(() => {
      const service = TestBed.inject(ArticlesService);
      service.fetchArticlesByTag('test').subscribe((data) => {
        expect(component.articlesSelectedByTag).toEqual(data.articles);
      })
    }));

    it('should not be called because selectedTag is null', () => {
      component.selectedTag = null;
      component.ngOnChanges();
      expect(component.articlesSelectedByTag).toEqual([]);
    });

    it('should not be called because tabIndex is not 2', () => {
      component.tabIndex = 0;
      component.ngOnChanges();
      expect(component.articlesSelectedByTag).toEqual([]);
    });

    });

    describe('When error is thrown', () => {
      let component: TaggedArticlesComponent;
      let fixture: ComponentFixture<TaggedArticlesComponent>;
    
      beforeEach(async () => {
        await TestBed.configureTestingModule({
          declarations: [TaggedArticlesComponent],
          providers: [
            { provide: ArticlesService, useClass: ArticlesServiceMockWithError },
            { provide: InfiniteScrollService, useClass: InfiniteScrollServiceMock }
          ]
        })
          .compileComponents();
      });
    
      beforeEach(() => {
        fixture = TestBed.createComponent(TaggedArticlesComponent);
        component = fixture.componentInstance;
        component.tabIndex = 2;
        component.selectedTag = 'test';
        component.lastItem = new QueryList<ElementRef<any>>();
        fixture.detectChanges();
        component.ngOnChanges();
      });
    
      it('onCatchError should be called', waitForAsync(() => {
        const service = TestBed.inject(ArticlesService);
        service.fetchArticlesByTag('test').pipe(
          catchError(() => {
            expect(component.error).toBe('Something went wrong :(');
            return of({articles: [], articlesCount: 0});
          })
        );
      }));
    
    });


  });







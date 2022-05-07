import { HttpErrorResponse } from '@angular/common/http';
import { ArticlesService } from './../../../shared/services/articles/articles.service';
import { IArticleResponse } from './../../../shared/models/IArticle';
import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalFeedComponent } from './global-feed.component';

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

describe('GlobalFeedComponent', () => {
  let component: GlobalFeedComponent;
  let fixture: ComponentFixture<GlobalFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalFeedComponent],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalFeedComponent);
    component = fixture.componentInstance;
    component.tabIndex = 1;
    component.isAuthorized = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setDataOnResponse should be called because tabIndex is 1', () => {
    const spy = spyOn<any>(component, 'setDataOnResponse').and.callThrough();
    component.ngOnChanges();
    expect(spy).toHaveBeenCalledWith(expectedData);
  });

  it('setDataOnResponse should be called because is Authorized is false', () => {
    component.isAuthorized = false;
    component.tabIndex = 0;
    const spy = spyOn<any>(component, 'setDataOnResponse').and.callThrough();
    component.ngOnChanges();
    expect(spy).toHaveBeenCalledWith(expectedData);
  });

});


// describe('GlobalFeedComponent', () => {
//   let component: GlobalFeedComponent;
//   let fixture: ComponentFixture<GlobalFeedComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [GlobalFeedComponent],
//       providers: [
//         { provide: ArticlesService, useClass: ArticlesServiceMockWithError },
//         { provide: InfiniteScrollService, useClass: InfiniteScrollServiceMock }

//       ]
//     })
//       .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(GlobalFeedComponent);
//     component = fixture.componentInstance;
//     component.tabIndex = 1;
//     component.isAuthorized = false;
//     component.lastItem = new QueryList<ElementRef<any>>();
//     fixture.detectChanges();
//   });

//   it('onCatchError should be called', () => {
//     const spy = spyOn<any>(component, 'onCatchError').and.callThrough();
//     component.ngOnChanges();
//     expect(spy).toHaveBeenCalled();
//   });

// });


// describe('GlobalFeedComponent', () => {
//   let component: GlobalFeedComponent;
//   let fixture: ComponentFixture<GlobalFeedComponent>;
//   let articleServiceSpy: jasmine.SpyObj<ArticlesService>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [GlobalFeedComponent],
//       providers: [
//         { provide: ArticlesService, useClass: ArticlesServiceMockWithError },
//       ]
//     })
//       .compileComponents();
//   });

//   beforeEach(() => {
//     articleServiceSpy = jasmine.createSpyObj('ArticlesService', ['fetchArticles']);
//     fixture = TestBed.createComponent(GlobalFeedComponent);
//     component = fixture.componentInstance;
//     component.tabIndex = 1;
//     component.isAuthorized = false;
//     fixture.detectChanges();
//   });

//   it('onCatchError should be called', () => {
//     articleServiceSpy.fetchArticles.and.returnValue(throwError(() => Error('Fetching articles failed')));
//     fixture.detectChanges();
//     const spy = spyOn<any>(component, 'onCatchError').and.callThrough();
//     component.ngOnChanges();
//     fixture.detectChanges();
//     expect(spy).toHaveBeenCalled();
//     expect(component.error).toBe('Something went wrong :(');
//   });

// });
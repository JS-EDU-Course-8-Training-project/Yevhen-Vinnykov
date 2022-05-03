import { ArticlesService } from './../../../shared/services/articles/articles.service';
import { IArticleResponse } from './../../../shared/models/IArticle';
import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourFeedComponent } from './your-feed.component';

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

describe('YourFeedComponent', () => {
  let component: YourFeedComponent;
  let fixture: ComponentFixture<YourFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YourFeedComponent],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourFeedComponent);
    component = fixture.componentInstance;
    component.tabIndex = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getFollowedArticles should be called', () => {
    const spy = spyOn<any>(component, 'getFollowedArticles').and.callThrough();
    component.ngOnChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('getFollowedArticles should not be called', () => {
    component.tabIndex = 1;
    const spy = spyOn<any>(component, 'getFollowedArticles').and.callThrough();
    component.ngOnChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('setDataOnResponse should be called', () => {
    const spy = spyOn<any>(component, 'setDataOnResponse').and.callThrough();
    component.ngOnChanges();
    expect(spy).toHaveBeenCalledWith(expectedData);
    expect(component.followedArticles).toEqual(expectedData.articles);
  });

});

describe('YourFeedComponent', () => {
  let component: YourFeedComponent;
  let fixture: ComponentFixture<YourFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YourFeedComponent],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMockWithError }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourFeedComponent);
    component = fixture.componentInstance;
    component.tabIndex = 0;
    fixture.detectChanges();
  });

  it('onCatchError should be called', () => {
    const spy = spyOn<any>(component, 'onCatchError').and.callThrough();
    component.ngOnChanges();
    expect(spy).toHaveBeenCalledWith(Error('Fetching articles failed'));
  });

});
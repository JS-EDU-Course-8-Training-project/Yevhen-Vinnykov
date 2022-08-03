import { IArticleResponse } from '../../shared/models/IArticle';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleListComponent } from './article-list.component';
import { InfiniteScrollService } from '../../shared/services/infinite-scroll/infinite-scroll.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const dataMock: IArticleResponse = {
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
        following: false,
      },
    },
  ],
  articlesCount: 10,
};

class InfiniteScrollServiceMock {
  public initObserver = () => ({});
  public observer = { observe: () => ({}) };
}

describe('GLOBAL FEED COMPONENT', () => {
  describe('WHEN NO ERROR IS THROWN', () => {
    let component: ArticleListComponent;
    let fixture: ComponentFixture<ArticleListComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ArticleListComponent],
        providers: [
          {
            provide: InfiniteScrollService,
            useClass: InfiniteScrollServiceMock,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ArticleListComponent);
      component = fixture.componentInstance;
      component.tabIndex = 1;
      component.isAuthorized = true;
      component.selectedTag = 'test-tag';
      component.articles = dataMock.articles;
      component.error = '';
      component.isLastPage = false;
      component.isLoading = false;
      component.cb = () => ({});
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});

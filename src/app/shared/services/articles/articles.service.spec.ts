import { of } from 'rxjs';
import { IArticleResponse } from './../../models/IArticle';
import { HttpClient } from '@angular/common/http';

import { ArticlesService } from './articles.service';
import { INewArticle } from '../../models/INewArticle';
import { IUpdateArticle } from '../../models/IUpdateArticle';

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
        following: false,
      },
    },
  ],
  articlesCount: 10,
};

describe('ARTICLES SERVICE > GET METHODS', () => {
  let articlesService: ArticlesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    articlesService = new ArticlesService(httpClientSpy);
  });

  it('getArticles methods should return expected data', () => {
    httpClientSpy.get.and.returnValue(of(expectedData));

    articlesService.fetchArticles().subscribe((articles) => {
      expect(articles).toEqual(expectedData);
    });

    articlesService.fetchFollowedArticles().subscribe((articles) => {
      expect(articles).toEqual(expectedData);
    });

    articlesService.fetchArticlesByTag('test-tag').subscribe((articles) => {
      expect(articles).toEqual(expectedData);
    });

    articlesService.fetchUserArticles('test-username').subscribe((articles) => {
      expect(articles).toEqual(expectedData);
    });

    articlesService
      .fetchFavoritedArticles('test-username')
      .subscribe((articles) => {
        expect(articles).toEqual(expectedData);
      });

    expect(httpClientSpy.get.calls.count()).toBe(5);
  });

  it('fetchArticle method should return expected data', () => {
    const expectedArticle = { article: expectedData.articles[0] };
    httpClientSpy.get.and.returnValue(of(expectedArticle));

    articlesService.fetchArticle('test-slug').subscribe((article) => {
      expect(article).toEqual(expectedArticle.article);
    });

    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('fetchTags methods should return expected data', () => {
    const expectedTags = { tags: ['test-tag'] };
    httpClientSpy.get.and.returnValue(of(expectedTags));

    articlesService.fetchTags().subscribe((tags) => {
      expect(tags).toEqual(expectedTags.tags);
    });

    expect(httpClientSpy.get.calls.count()).toBe(1);
  });
});

describe('ARTICLES SERVICE > POST METHODS', () => {
  let articlesService: ArticlesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    articlesService = new ArticlesService(httpClientSpy);
  });

  it('createArticle should create an article and return correct data', () => {
    const expectedArticle = expectedData.articles[0];
    const newArticleMock: INewArticle = {
      title: 'test-title',
      description: 'test-description',
      body: 'test-body',
      tagList: ['test-tag'],
    };

    httpClientSpy.post.and.returnValue(of(expectedArticle));

    articlesService.createArticle(newArticleMock).subscribe((article) => {
      expect(article).toEqual(expectedArticle);
    });

    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

  it('addToFavorites should return correct data', () => {
    const expectedArticle = { article: expectedData.articles[0] };
    httpClientSpy.post.and.returnValue(of(expectedArticle));

    articlesService.addToFavorites('test-slug').subscribe((article) => {
      expect(article).toEqual(expectedArticle.article);
    });

    expect(httpClientSpy.post.calls.count()).toBe(1);
  });
});

describe('ARTICLES SERVICE > PUT METHODS', () => {
  let articlesService: ArticlesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['put']);
    articlesService = new ArticlesService(httpClientSpy);
  });

  it('updateArticle should update an article and return correct data', () => {
    const expectedArticle = expectedData.articles[0];
    httpClientSpy.put.and.returnValue(of(expectedArticle));

    const updateArticleMock: IUpdateArticle = {
      title: 'test-title',
      description: 'test-description',
      body: 'test-body',
    };

    articlesService
      .updateArticle('test-slug', updateArticleMock)
      .subscribe((article) => {
        expect(article).toEqual(expectedArticle);
      });

    expect(httpClientSpy.put.calls.count()).toBe(1);
  });
});

describe('ARTICLES SERVICE > DELETE METHODS', () => {
  let articlesService: ArticlesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['delete']);
    articlesService = new ArticlesService(httpClientSpy);
  });

  it('deleteArticle should delete an article and return empty object', () => {
    httpClientSpy.delete.and.returnValue(of({}));

    articlesService.deleteArticle('test-slug').subscribe((res) => {
      expect(res).toEqual({});
    });

    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });

  it('removeFromFavorites should return correct data', () => {
    const expectedArticle = { article: expectedData.articles[0] };
    httpClientSpy.delete.and.returnValue(of(expectedArticle));

    articlesService.removeFromFavorites('test-slug').subscribe((article) => {
      expect(article).toEqual(expectedArticle.article);
    });

    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });
});

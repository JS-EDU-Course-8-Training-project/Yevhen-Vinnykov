import { of } from 'rxjs';
import { IArticleResponse } from './../../models/IArticle';
import { HttpClient } from '@angular/common/http';

import { ArticlesService } from './articles.service';
import { IUpdateArticle } from '../../models/IUpdateArticle';

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
    httpClientSpy.get.and.returnValue(of(expectedData));
  });

  it('fetchArticles() should return expected data', async () => {
    const allArticles = await articlesService.fetchArticles();

    expect(allArticles).toEqual(expectedData);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('fetchFollowedArticles() should return expected data', async () => {
    const followedArticles = await articlesService.fetchFollowedArticles();

    expect(followedArticles).toEqual(expectedData);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('fetchArticlesByTag() should return expected data', async () => {
    const taggedArticles = await articlesService.fetchArticlesByTag('test');

    expect(taggedArticles).toEqual(expectedData);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('fetchUserArticles() should return expected data', async () => {
    const userArticles = await articlesService.fetchUserArticles('test');

    expect(userArticles).toEqual(expectedData);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('fetchFavoritedArticles() should return expected data', async () => {
    const favoritedArticles = await articlesService.fetchFavoritedArticles(
      'test'
    );

    expect(favoritedArticles).toEqual(expectedData);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('fetchArticle() should return expected data', async () => {
    const expectedArticle = { article: expectedData.articles[0] };
    httpClientSpy.get.and.returnValue(of(expectedArticle));

    const article = await articlesService.fetchArticle('test-slug');

    expect(article).toEqual(expectedArticle.article);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('fetchTags() should return expected data', async () => {
    const expectedTags = { tags: ['test-tag'] };
    httpClientSpy.get.and.returnValue(of(expectedTags));

    const tags = await articlesService.fetchTags();

    expect(tags).toEqual(expectedTags.tags);
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

  it('createArticle() should create an article and return correct data', async () => {
    const expectedArticle = expectedData.articles[0];
    httpClientSpy.post.and.returnValue(of({ article: expectedArticle }));

    const article = await articlesService.createArticle(expectedArticle);

    expect(article).toEqual(expectedArticle);
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

  it('addToFavorites() should return correct data', async () => {
    const expectedArticle = { article: expectedData.articles[0] };
    httpClientSpy.post.and.returnValue(of(expectedArticle));

    const article = await articlesService.addToFavorites('test');

    expect(article).toEqual(expectedArticle.article);
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

  it('updateArticle() should update an article and return correct data', async () => {
    const expectedArticle = expectedData.articles[0];
    httpClientSpy.put.and.returnValue(of({ article: expectedArticle }));

    const updateArticleMock: IUpdateArticle = {
      title: 'test-title',
      description: 'test-description',
      body: 'test-body',
    };

    const updateArticle = await articlesService.updateArticle(
      'test-slug',
      updateArticleMock
    );

    expect(updateArticle).toEqual(expectedArticle);
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

  it('deleteArticle() should delete an article and return an empty object', async () => {
    httpClientSpy.delete.and.returnValue(of({}));

    const response = await articlesService.deleteArticle('test-slug');

    expect(response).toEqual({});
    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });

  it('removeFromFavorites() should return correct data', async () => {
    const expectedArticle = { article: expectedData.articles[0] };
    httpClientSpy.delete.and.returnValue(of(expectedArticle));

    const article = await articlesService.removeFromFavorites('test');

    expect(article).toEqual(expectedArticle.article);
    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });
});

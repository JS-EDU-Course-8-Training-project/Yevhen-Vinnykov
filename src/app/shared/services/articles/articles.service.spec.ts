import { of } from 'rxjs';
import { IArticleResponse } from './../../models/IArticle';
import { HttpClient } from '@angular/common/http';

import { ArticlesService } from './articles.service';
import { ICreatedArticle } from '../../models/ICreatedArticle';
import { IUpdateArticle } from '../../models/IUpdateArticle';

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

//////////////////////////////////////GET/////////////////////////////////////////////

describe('ArticlesService Get Methods', () => {
  let articlesService: ArticlesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    articlesService = new ArticlesService(httpClientSpy);
  });

  it('getArticles methods should return expected data', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of(expectedData));
    articlesService.fetchArticles().subscribe({
      next: articles => {
        expect(articles).withContext('expected articles').toEqual(expectedData);
        done();
      },
      error: done.fail
    });

    articlesService.fetchFollowedArticles().subscribe({
      next: articles => {
        expect(articles).withContext('expected articles').toEqual(expectedData);
        done();
      },
      error: done.fail
    });

    articlesService.fetchArticlesByTag('test-tag').subscribe({
      next: articles => {
        expect(articles).withContext('expected articles').toEqual(expectedData);
        done();
      },
      error: done.fail
    });

    articlesService.fetchUserArticles('test-username').subscribe({
      next: articles => {
        expect(articles).withContext('expected articles').toEqual(expectedData);
        done();
      },
      error: done.fail
    });

    articlesService.fetchFavoritedArticles('test-username').subscribe({
      next: articles => {
        expect(articles).withContext('expected articles').toEqual(expectedData);
        done();
      },
      error: done.fail
    });

    expect(httpClientSpy.get.calls.count()).toBe(5);
  });

  it('fetchArticle methods should return expected data', () => {
    const expectedArticle = { article: expectedData.articles[0] };
    httpClientSpy.get.and.returnValue(of(expectedArticle));
    articlesService.fetchArticle('test-slug').subscribe(article => {
      expect(article).withContext('expected article').toEqual(expectedArticle.article);
    });
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('fetchTags methods should return expected data', () => {
    const expectedTags = { tags: ['test-tag'] };
    httpClientSpy.get.and.returnValue(of(expectedTags));
    articlesService.fetchTags().subscribe(tags => {
      expect(tags).withContext('expected tags').toEqual(expectedTags.tags);
    });
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

});

//////////////////////////////////////POST/////////////////////////////////////////////

describe('ArticlesService Post Methods', () => {
  let articlesService: ArticlesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    articlesService = new ArticlesService(httpClientSpy);
  });

  it('createArticle should create an article and return correct data', () => {
    const expectedArticle = expectedData.articles[0];
    const newArticleMock: ICreatedArticle = {
      title: 'test-title',
      description: 'test-description',
      body: 'test-body',
      tagList: ['test-tag']
    };
    httpClientSpy.post.and.returnValue(of(expectedArticle));
    articlesService.createArticle(newArticleMock).subscribe(article => {
      expect(article).withContext('expected article').toEqual(expectedArticle);
    });
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

  it('addToFavorites should return correct data', () => {
    const expectedArticle = { article: expectedData.articles[0] };
    httpClientSpy.post.and.returnValue(of(expectedArticle));
    articlesService.addToFavorites('test-slug').subscribe(article => {
      expect(article).withContext('expected article').toEqual(expectedArticle.article);
    });
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

});

//////////////////////////////////////PUT/////////////////////////////////////////////


describe('ArticlesService Put Methods', () => {
  let articlesService: ArticlesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['put']);
    articlesService = new ArticlesService(httpClientSpy);
  });

  it('updateArticle should update an article and return correct data', () => {
    const expectedArticle = expectedData.articles[0];
    const updateArticleMock: IUpdateArticle = {
      title: 'test-title',
      description: 'test-description',
      body: 'test-body',
    };
    httpClientSpy.put.and.returnValue(of(expectedArticle));
    articlesService.updateArticle('test-slug', updateArticleMock).subscribe(article => {
      expect(article).withContext('expected article').toEqual(expectedArticle);
    });
    expect(httpClientSpy.put.calls.count()).toBe(1);
  });

});

//////////////////////////////////////DELETE/////////////////////////////////////////////


describe('ArticlesService Delete Methods', () => {
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
      expect(article).withContext('expected article').toEqual(expectedArticle.article);
    });
    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });

});

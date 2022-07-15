import { of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { IArticle } from 'src/app/shared/models/IArticle';
import { TestBed } from '@angular/core/testing';

import { ArticleResolver } from './article-resolver.resolver';

const expectedData: IArticle = {
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
  }
};

class ArticleServiceStub {
  public fetchArticle = (slug: string) => of(expectedData);
}

describe('ARTICLE RESOLVER', () => {
  let resolver: ArticleResolver;
  let route: ActivatedRouteSnapshot;
  let routerState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ArticlesService, useClass: ArticleServiceStub }
      ]
    });
    resolver = TestBed.inject(ArticleResolver);
    route = new ActivatedRouteSnapshot();
    route.params = { slug: 'test-slug' };
  });

  it('should return correct data', () => {
    resolver.resolve(route, routerState).subscribe(article => {
      expect(article).toEqual(expectedData);
    });
  });

});

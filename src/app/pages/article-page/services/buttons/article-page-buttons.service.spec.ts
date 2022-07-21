import { IArticle } from './../../../../shared/models/IArticle';
import { TestBed } from '@angular/core/testing';

import { ArticlePageButtonsService } from './article-page-buttons.service';

const article: IArticle = {
  id: '1',
  slug: 'test-slug',
  title: 'test-tile',
  description: 'test-description',
  body: 'test-body',
  image: 'test-image',
  tagList: ['test-tag'],
  createdAt: Date.now().toLocaleString(),
  updatedAt: Date.now().toLocaleString(),
  favorited: false,
  favoritesCount: 2,
  author: {
    username: 'test',
    bio: 'test-bio',
    image: 'test-author',
    following: false,
  },
};

describe('ARTICLE PAGE BUTTONS SERVICE', () => {
  let service: ArticlePageButtonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlePageButtonsService);
  });

  it('should create initial state', () => {
    const initialState = {
      followingInProgress: false,
      favoriteInProgress: false,
      isLiked: article.favorited,
      isFollowed: article.author.following,
      likesCount: article.favoritesCount,
    };

    const spy = spyOn(service, 'createInitialState').and.callThrough();

    service.createInitialState(article);

    expect(spy).toHaveBeenCalled();
    expect(service.createInitialState(article)).toEqual(initialState);
  });

  it('Initialize method should be called', () => {
    const spy = spyOn(service, 'initialize').and.callThrough();

    service.initialize(article);

    expect(spy).toHaveBeenCalled();
    expect(service.initialize(article)).toEqual(service.ButtonsState$);
  });

  it('UpdateState method should be called', () => {
    const spy = spyOn(service, 'updateState').and.callThrough();
    service.updateState('isFollowed', true);
    expect(spy).toHaveBeenCalled();
  });
});

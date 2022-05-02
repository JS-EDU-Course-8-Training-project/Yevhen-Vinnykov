import { IArticle } from './../../../../shared/models/IArticle';
import { TestBed } from '@angular/core/testing';

import { ArticlePageButtonsService } from './article-page-buttons.service';

const article: IArticle = {
  slug: 'test-slug',
  title: 'test-tile',
  description: 'test-description',
  body: 'test-body',
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
  }
};

describe('ArticlePageButtonsService', () => {
  let service: ArticlePageButtonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlePageButtonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create initial state', () => {
    const initialState = {
      followingInProgress: false,
      favoriteInProgress: false,
      isLiked: article?.favorited,
      isFollowed: article?.author?.following,
      likesCount: article?.favoritesCount
    };
    const spy = spyOn(service, 'createInitialState').and.callThrough();
    spy(article);
    expect(spy).toHaveBeenCalled();
    expect(spy(article)).toEqual(initialState);
  });

  it('Initialize method should be called', () => {
    const spy = spyOn(service, 'initialize').and.callThrough();
    spy(article);
    expect(spy).toHaveBeenCalled();
  });


  it('UpdateState method should be called', () => {
    const initialState = {
      followingInProgress: false,
      favoriteInProgress: false,
      isLiked: article?.favorited,
      isFollowed: article?.author?.following,
      likesCount: article?.favoritesCount
    };
    const spy = spyOn(service, 'updateState').and.callThrough();
    spy('isFollowed', true);
    expect(spy).toHaveBeenCalled();
  });

});



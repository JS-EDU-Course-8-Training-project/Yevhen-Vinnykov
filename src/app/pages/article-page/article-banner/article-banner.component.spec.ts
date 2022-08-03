import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IArticle } from 'src/app/shared/models/IArticle';

import { ArticleBannerComponent } from './article-banner.component';

const articleMock: IArticle = {
  id: '1',
  slug: 'test-slug',
  title: '',
  description: '',
  body: '',
  image: '',
  tagList: [],
  createdAt: '',
  updatedAt: '',
  favorited: false,
  favoritesCount: 2,
  author: {
    username: 'test',
    bio: 'test-bio',
    image: '',
    following: false,
  },
};

describe('ARTICLE BANNER COMPONENT', () => {
  let component: ArticleBannerComponent;
  let fixture: ComponentFixture<ArticleBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleBannerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleBannerComponent);
    component = fixture.componentInstance;
    component.isAuth = true;
    component.isMyself = true;
    component.article = articleMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

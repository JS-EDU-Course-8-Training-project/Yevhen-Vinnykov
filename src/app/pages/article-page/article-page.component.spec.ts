import { IArticle } from 'src/app/shared/models/IArticle';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePageComponent } from './article-page.component';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

const userMock: IExistingUser = {
  id: '1',
  email: 'test-user@example.com',
  password: 'test-password',
  image: '',
  username: 'test-username',
};

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

class AuthServiceMock {
  public authUser$ = new BehaviorSubject<IExistingUser>(userMock);
}

class ActivatedRouteMock {
  public data = of({
    article: articleMock,
  });
}

describe('ArticlePageComponent', () => {
  let component: ArticlePageComponent;
  let fixture: ComponentFixture<ArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticlePageComponent],
      imports: [MatCardModule],
      providers: [
        { provide: AuthorizationService, useClass: AuthServiceMock },
        { provide: ActivatedRoute, useClass: ActivatedRouteMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

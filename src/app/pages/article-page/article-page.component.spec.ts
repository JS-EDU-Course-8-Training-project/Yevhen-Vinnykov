import { IArticle } from 'src/app/shared/models/IArticle';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePageComponent } from './article-page.component';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

class AuthServiceMock {
  public authUser$ = of({} as IExistingUser);
}

class ActivatedRouteMock {
  public data = of({
    article: {} as IArticle,
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

  it('requestForComments$ should emit', () => {
    const spy = spyOn(component.requestForComments$, 'next');
    component.reuestComments();
    expect(spy).toHaveBeenCalled();
  });
});

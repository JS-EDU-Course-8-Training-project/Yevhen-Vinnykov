import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ArticlesService } from './../../shared/services/articles/articles.service';
import { IArticle } from './../../shared/models/IArticle';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePageComponent } from './article-page.component';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { UsersService } from 'src/app/shared/services/users/users.service';

class ArticlesServiceMock {
  public fetchArticle = (slug: string) => of({} as IArticle);
}

class UsersServiceMock {
  public fetchAuthUser = () => of({} as IExistingUser)
}

class RouterMock {
  url = 'test/url/test'
}

describe('ArticlePageComponent', () => {
  let component: ArticlePageComponent;
  let fixture: ComponentFixture<ArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArticlePageComponent,
      ],
      imports: [
        MatCardModule
      ],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock },
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: Router, useClass: RouterMock }
      ]
    })
      .compileComponents();
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

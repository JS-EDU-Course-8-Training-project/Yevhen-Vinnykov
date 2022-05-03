import { of, throwError } from 'rxjs';
import { IArticleResponse } from './../../../shared/models/IArticle';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyArticlesComponent } from './my-articles.component';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';


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
        following: true,
      }
    },
  ],
  articlesCount: 10
};

class ArticlesServiceMock {
  public fetchUserArticles = () => of(expectedData);
}

class ArticlesServiceMockWithError {
  public fetchUserArticles = () => throwError(() => Error('Fetching articles failed'));
}


describe('MyArticlesComponent', () => {
  let component: MyArticlesComponent;
  let fixture: ComponentFixture<MyArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyArticlesComponent],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyArticlesComponent);
    component = fixture.componentInstance;
    component.username = 'test-username';
    component.tabIndex = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getArticles should be called', () => {
    const spy = spyOn<any>(component, 'getArticles').and.callThrough();
    component.ngOnChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('getArticles should not be called', () => {
    component.tabIndex = 1;
    const spy = spyOn<any>(component, 'getArticles').and.callThrough();
    component.ngOnChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('setData should be called', () => {
    const spy = spyOn<any>(component, 'setData').and.callThrough();
    component.ngOnChanges();
    expect(spy).toHaveBeenCalledWith(expectedData);
    expect(component.myArticles).toEqual(expectedData.articles);
  });

});


describe('OnCatchError', () => {
  let component: MyArticlesComponent;
  let fixture: ComponentFixture<MyArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyArticlesComponent],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMockWithError }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyArticlesComponent);
    component = fixture.componentInstance;
    component.username = 'test-username';
    component.tabIndex = 0;
    fixture.detectChanges();
  });

  it('onCatchError should be called', () => {
    const spy = spyOn<any>(component, 'onCatchError').and.callThrough();
    component.ngOnChanges();
    expect(spy).toHaveBeenCalledWith(Error('Fetching articles failed'));
  });
 
});
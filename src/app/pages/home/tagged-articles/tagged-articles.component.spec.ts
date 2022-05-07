import { ArticlesService } from './../../../shared/services/articles/articles.service';
import { of, throwError } from 'rxjs';
import { IArticleResponse } from './../../../shared/models/IArticle';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggedArticlesComponent } from './tagged-articles.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

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


class ArticlesServiceMock {
  public fetchArticlesByTag = (tag: string, offset: number, limit: number) => of(expectedData);
}

class ArticlesServiceMockWithError {
  public fetchArticlesByTag = (tag: string, offset: number, limit: number) => throwError(() => new Error('Failed'));
}

describe('TaggedArticlesComponent', () => {
  let component: TaggedArticlesComponent;
  let fixture: ComponentFixture<TaggedArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaggedArticlesComponent],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggedArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('GetTaggedArticles', () => {
    
    beforeEach(() => {
      fixture = TestBed.createComponent(TaggedArticlesComponent);
      component = fixture.componentInstance;
      component.tabIndex = 1;
      component.selectedTag = 'test';
      fixture.detectChanges();
    });

    it('should not be called because tab index is not 2', () => {
      const spy = spyOn<any>(component, 'getTaggedArticles').and.callThrough();
      component.ngOnChanges();
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should be called because tab index is 2', () => {
      const spy = spyOn<any>(component, 'getTaggedArticles').and.callThrough();
      component.tabIndex = 2;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });
});



// describe('TaggedArticlesComponent', () => {
//   let component: TaggedArticlesComponent;
//   let fixture: ComponentFixture<TaggedArticlesComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [TaggedArticlesComponent],
//       providers: [
//         { provide: ArticlesService, useClass: ArticlesServiceMockWithError },
//       ]
//     })
//       .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(TaggedArticlesComponent);
//     component = fixture.componentInstance;
//     component.tabIndex = 2;
//     component.selectedTag = 'test';
//     fixture.detectChanges();
//   });

//   it('onCatchError should be called', () => {
//     const spy = spyOn<any>(component, 'onCatchError').and.callThrough();
//     component.ngOnChanges();
//     fixture.detectChanges();
//     expect(spy).toHaveBeenCalled();
//   });

// });
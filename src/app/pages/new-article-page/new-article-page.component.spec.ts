import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { IUpdateArticle } from './../../shared/models/IUpdateArticle';
import { of, Observable, throwError } from 'rxjs';
import { IArticle } from './../../shared/models/IArticle';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewArticlePageComponent } from './new-article-page.component';
import { ICreatedArticle } from 'src/app/shared/models/ICreatedArticle';
import { By } from '@angular/platform-browser';

const expectedData: IArticle = {
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


class ArticlesServiceMock {

  public fetchArticle = (slug: string): Observable<IArticle> => of(expectedData);

  public createArticle = (newArticle: ICreatedArticle): Observable<IArticle> => of({
    ...expectedData,
    title: newArticle.title,
    description: newArticle.description,
    body: newArticle.body,
    tagList: [...newArticle.tagList]
  });

  public updateArticle = (slug: string, article: IUpdateArticle): Observable<IArticle> => of({
    ...expectedData,
    title: article.title,
    description: article.description,
    body: article.body
  });

}

class ArticlesServiceMockWithError {
  public fetchArticle = (slug: string) => throwError(() => 'Fetching articles failed');
}

class RouterMockEditMode {
  public url = 'localhost:3000/article/test-slug';
}

class RouterMockCreateMode {
  public url = '/create-article';
}

describe('NewArticlePageComponent Edit Mode', () => {
  let component: NewArticlePageComponent;
  let fixture: ComponentFixture<NewArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewArticlePageComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock },
        { provide: Router, useClass: RouterMockEditMode }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in edit mode', () => {
    expect(component.isEditMode).toBeTruthy();
    expect(component.articleForm.controls['title'].value).toBe('test-title');
    expect(component.slug).toBe('test-slug');
  });

  it('should update an article', waitForAsync(() => {
    const spyHandleArticleAction = spyOn(component, 'handleArticleAction').and.callThrough();
    const spyArticleAction = spyOn<any>(component, 'articleAction');
    const expectedData = {
      title: 'new-test-title',
      description: 'test-description',
      body: 'test-body',
      tagList: ['test-tag']
    };
    component.articleForm.controls['title'].setValue('new-test-title');
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;
    submitButton.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spyHandleArticleAction).toHaveBeenCalled();
      expect(spyArticleAction).toHaveBeenCalledWith(component.slug, expectedData);
    });
  }));

});



describe('NewArticlePageComponent Create Mode', () => {
  let component: NewArticlePageComponent;
  let fixture: ComponentFixture<NewArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewArticlePageComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock },
        { provide: Router, useClass: RouterMockCreateMode }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should initialize in create mode', () => {
    expect(component.isEditMode).toBeFalsy();
    expect(component.articleForm.controls['title'].value).toBe('');
  });

  it('form should be invalid on first render', () => {
    expect(component.articleForm.valid).toBe(false);
  });

  it('button should be disabled on first render', () => {
    const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(submitButton.disabled).toBe(true);
  });

  it('form should be valid on data input and button should be enabled', () => {
    const newArticle = {
      title: 'new-test-title',
      description: 'test-description',
      body: 'test-body',
      tagList: 'test-tag'
    };
    const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;
    component.articleForm.setValue(newArticle);
    component.articleForm.markAllAsTouched();
    fixture.detectChanges();
    expect(component.articleForm.valid).toBe(true);
    expect(component.articleForm.controls['title'].value).toBe('new-test-title');
    expect(submitButton.disabled).toBe(false);
  });

  it('should create an article', waitForAsync(() => {
    const spyHandleArticleAction = spyOn(component, 'handleArticleAction').and.callThrough();
    const spyArticleAction = spyOn<any>(component, 'articleAction');
    const newArticle = {
      title: 'new-test-title',
      description: 'test-description',
      body: 'test-body',
      tagList: 'test-tag'
    };
    component.articleForm.setValue(newArticle);
    component.articleForm.markAllAsTouched();
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;
    submitButton.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isDataSaved()).toBe(true);
      expect(spyHandleArticleAction).toHaveBeenCalled();
      expect(spyArticleAction).toHaveBeenCalledWith(component.slug, { ...newArticle, tagList: ['test-tag'] });
    });
  }));

});



// describe('OnCatchError Method', () => {
//   let component: NewArticlePageComponent;
//   let fixture: ComponentFixture<NewArticlePageComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [NewArticlePageComponent],
//       imports: [ReactiveFormsModule, FormsModule],
//       providers: [
//         { provide: ArticlesService, useClass: ArticlesServiceMockWithError },
//         { provide: Router, useClass: RouterMockEditMode }
//       ]
//     })
//       .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(NewArticlePageComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });


//   it('should be invoked', () => {
//     const spy = spyOn<any>(component, 'onCatchError').and.callThrough();
//     component.ngOnInit();
//     expect(spy).toHaveBeenCalledWith('Fetching articles failed');
//   });

// });


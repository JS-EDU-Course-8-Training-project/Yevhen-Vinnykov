import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { By } from '@angular/platform-browser';

import { NewArticlePageComponent } from './new-article-page.component';
import {
  ArticlesServiceMock,
  RouterMockCreateMode,
  RouterMockEditMode,
} from './new-article-page.mocks.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';

/****************************************************************************************
  NEW ARTICLE PAGE > EDIT MODE 
 ****************************************************************************************/

describe('NEW ARTICLE PAGE > EDIT MODE', () => {
  let component: NewArticlePageComponent;
  let fixture: ComponentFixture<NewArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewArticlePageComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock },
        { provide: Router, useClass: RouterMockEditMode },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize in edit mode', waitForAsync(() => {
    fixture.whenStable().then(() => {
      expect(component.isEditMode).toBe(true);
      expect(component.articleForm.controls['title'].value).toBe('test-title');
      expect(component.slug).toBe('test-slug');
    });
  }));

  it('should update an article', waitForAsync(() => {
    const spyHandleSubmit = spyOn(component, 'handleSubmit').and.callThrough();

    component.articleForm.controls['title'].setValue('new-test-title');
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('[type=submit]')
    ).nativeElement;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      submitButton.click();

      expect(spyHandleSubmit).toHaveBeenCalled();
    });
  }));
});

/****************************************************************************************
  NEW ARTICLE PAGE > CREATE MODE
 ****************************************************************************************/

describe('NEW ARTICLE PAGE > CREATE MODE', () => {
  let component: NewArticlePageComponent;
  let fixture: ComponentFixture<NewArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewArticlePageComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMock },
        { provide: Router, useClass: RouterMockCreateMode },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize in create mode', () => {
    expect(component.isEditMode).toBe(false);
    expect(component.articleForm.controls['title'].value).toBe('');
  });

  it('form should be invalid on first render', () => {
    expect(component.articleForm.valid).toBe(false);
  });

  it('button should be disabled on first render', () => {
    const submitButton = fixture.debugElement.query(
      By.css('[type=submit]')
    ).nativeElement;
    expect(submitButton.disabled).toBe(true);
  });

  it('form should be valid on data input and button should be enabled', () => {
    const newArticle = {
      title: 'new-test-title',
      description: 'test-description',
      body: 'test-body',
      image: 'test-image',
      tagList: [{ tag: 'test-tag' }],
    };
    const submitButton = fixture.debugElement.query(
      By.css('[type=submit]')
    ).nativeElement;

    component.articleForm.setValue(newArticle);
    component.articleForm.markAllAsTouched();
    fixture.detectChanges();

    expect(component.articleForm.valid).toBe(true);
    expect(component.articleForm.controls['title'].value).toBe(
      'new-test-title'
    );
    expect(submitButton.disabled).toBe(false);
  });

  it('should create an article', waitForAsync(() => {
    const spyHandleSubmit = spyOn(component, 'handleSubmit').and.callThrough();

    const newArticle = {
      title: 'new-test-title',
      description: 'test-description',
      body: 'test-body',
      image: 'test-image',
      tagList: [{ tag: 'test-tag' }],
    };

    component.articleForm.setValue(newArticle);
    component.articleForm.markAllAsTouched();
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('[type=submit]')
    ).nativeElement;
    submitButton.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.isDataSaved()).toBe(true);
      expect(spyHandleSubmit).toHaveBeenCalled();
    });
  }));
});

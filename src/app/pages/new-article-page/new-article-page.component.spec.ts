import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { By } from '@angular/platform-browser';

import { NewArticlePageComponent } from './new-article-page.component';
import {
  ArticlesServiceMock,
  ArticlesServiceMockWithError,
  RouterMockCreateMode,
  RouterMockEditMode,
} from './new-article-page.mocks.spec';

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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize in edit mode', () => {
    expect(component.isEditMode).toBe(true);
    expect(component.articleForm.controls['title'].value).toBe('test-title');
    expect(component.slug).toBe('test-slug');
  });

  it('should update an article', waitForAsync(() => {
    const spyHandleArticleAction = spyOn(
      component,
      'handleArticleAction'
    ).and.callThrough();
    const spyArticleAction = spyOn<any>(component, 'articleAction');
    const expectedData = {
      title: 'new-test-title',
      tagList: ['test-tag'],
    };

    component.articleForm.controls['title'].setValue('new-test-title');
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('[type=submit]')
    ).nativeElement;
    submitButton.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(spyHandleArticleAction).toHaveBeenCalled();
      expect(spyArticleAction).toHaveBeenCalledWith(
        component.slug,
        expectedData
      );
    });
  }));
});

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
    const spyHandleArticleAction = spyOn(
      component,
      'handleArticleAction'
    ).and.callThrough();
    const spyArticleAction = spyOn<any>(
      component,
      'articleAction'
    ).and.callThrough();

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
      expect(spyHandleArticleAction).toHaveBeenCalled();
      expect(spyArticleAction).toHaveBeenCalledWith(component.slug, {
        ...newArticle,
        tagList: ['test-tag'],
      });
    });
  }));
});

describe('NEW ARTICLE PAGE > ON CATCH ERROR METHOD', () => {
  let component: NewArticlePageComponent;
  let fixture: ComponentFixture<NewArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewArticlePageComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ArticlesService, useClass: ArticlesServiceMockWithError },
        { provide: Router, useClass: RouterMockEditMode },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be invoked', () => {
    const spy = spyOn<any>(component, 'onCatchError').and.callThrough();
    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith('Fetching articles failed');
  });
});

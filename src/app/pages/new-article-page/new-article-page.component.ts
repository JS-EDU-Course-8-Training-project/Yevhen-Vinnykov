import { IUpdateArticle } from 'src/app/shared/models/IUpdateArticle';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil, Observable, catchError, of } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IArticle } from 'src/app/shared/models/IArticle';
import { ISavedData } from 'src/app/shared/models/ISavedData';
import { INewArticle } from 'src/app/shared/models/INewArticle';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';


@Component({
  selector: 'app-new-article-page',
  templateUrl: './new-article-page.component.html',
  styleUrls: ['./new-article-page.component.scss']
})

export class NewArticlePageComponent implements OnInit, OnDestroy, ISavedData {
  public articleForm!: FormGroup;
  public isEditMode!: boolean;
  public articleToEdit!: IArticle | null;
  public slug!: string;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService,
    private fb: FormBuilder,
    private router: Router,
    private redirectionService: RedirectionService
  ) { }

  ngOnInit(): void {
    this.isEditMode = this.router.url !== '/create-article';
    this.slug = this.router.url.split('/')[2];
    this.initializeForm();
    if (this.isEditMode) {
      this.articlesService.fetchArticle(this.slug)
        .pipe(
          takeUntil(this.notifier),
          catchError((err: HttpErrorResponse): any => this.onCatchError(err)))
        .subscribe((article: IArticle | any) => {
          this.articleToEdit = article;
          this.initializeForm();
          this.articleForm.markAllAsTouched();
        });
    }
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private initializeForm(): void {
    this.articleForm = this.fb.group({
      title: [this.articleToEdit?.title || '', [Validators.required]],
      description: [this.articleToEdit?.description || '', [Validators.required]],
      body: [this.articleToEdit?.body || '', [Validators.required]],
      tagList: [this.articleToEdit?.tagList?.join(',') || '', [Validators.required]],
    });
  }

  private onCatchError(error: HttpErrorResponse): Observable<IArticle> {
    console.error(error);
    return of({} as IArticle);
  }

  public checkIfValid(formControl: string): boolean {
    return !(this.articleForm.controls[formControl].touched && this.articleForm.controls[formControl].invalid);
  }


  private createArticleData(): INewArticle | IUpdateArticle {
    const formData = this.articleForm.getRawValue();
    formData.tagList = formData.tagList.split(',').map((tag: string) => tag.trim());
    const articleData = {} as INewArticle | IUpdateArticle;

    Object.keys(formData).forEach(key => {
      const isEditModeAndFieldChanged = this.articleToEdit?.[key as keyof IUpdateArticle] !== formData[key]
        && this.isEditMode;
      if (isEditModeAndFieldChanged || !this.isEditMode) {
        articleData[key as keyof IUpdateArticle] = formData[key];
      }
    });

    return articleData;

  }

  public handleArticleAction(): void {
    this.articleAction(this.slug, this.createArticleData());
    this.articleForm.reset();
  }

  private articleAction(slug: string, newArticle: INewArticle | IUpdateArticle) {
    const subscription: Observable<INewArticle | HttpErrorResponse> = this.isEditMode
      ? this.articlesService.updateArticle(slug, newArticle as IUpdateArticle)
      : this.articlesService.createArticle(newArticle as INewArticle);
    subscription
      .pipe(takeUntil(this.notifier))
      .subscribe((article: INewArticle | any) => {
        this.redirectionService.redirectByUrl(`article/${article.article.slug}`);
      });
  }

  public isDataSaved(): boolean {
    return !this.articleForm.dirty;
  }
}

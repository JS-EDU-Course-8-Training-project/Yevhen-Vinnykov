import { IUpdateArticle } from 'src/app/shared/models/IUpdateArticle';
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
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-new-article-page',
  templateUrl: './new-article-page.component.html',
  styleUrls: ['./new-article-page.component.scss'],
})
export class NewArticlePageComponent
  extends TestedComponent
  implements OnInit, OnDestroy, ISavedData
{
  public articleForm!: FormGroup;
  public error!: string;
  public isLoading = false;
  public isEditMode!: boolean;
  public articleToEdit!: IArticle | null;
  public slug!: string;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private articlesService: ArticlesService,
    private fb: FormBuilder,
    private router: Router,
    private redirectionService: RedirectionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isEditMode = this.router.url !== '/create-article';
    this.slug = this.router.url.split('/')[2];

    this.initializeForm();

    if (this.isEditMode) {
      this.articlesService
        .fetchArticle(this.slug)
        .pipe(
          takeUntil(this.notifier),
          catchError((err: string) => this.onCatchError(err))
        )
        .subscribe((article: IArticle) => {
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
      description: [
        this.articleToEdit?.description || '',
        [Validators.required],
      ],
      body: [this.articleToEdit?.body || '', [Validators.required]],
      tagList: [
        this.articleToEdit?.tagList?.join(',') || '',
        [Validators.required],
      ],
    });
  }

  private onSubmit(): void {
    this.error = '';
    this.articleForm.disable();
    this.isLoading = true;
  }

  public checkIfValid(formControl: string): boolean {
    return !(
      this.articleForm.controls[formControl].touched &&
      this.articleForm.controls[formControl].invalid
    );
  }

  private createArticleData(): INewArticle | IUpdateArticle {
    const formData = this.articleForm.getRawValue();
    formData.tagList = formData.tagList
      .split(',')
      .map((tag: string) => tag.trim());
    const articleData = {} as INewArticle | IUpdateArticle;

    Object.keys(formData).forEach((key) => {
      const isFieldChanged =
        this.articleToEdit?.[key as keyof IUpdateArticle] !== formData[key];
      if (isFieldChanged) {
        articleData[key as keyof IUpdateArticle] = formData[key];
      }
    });

    return articleData;
  }

  public handleArticleAction(): void {
    this.onSubmit();
    this.articleAction(this.slug, this.createArticleData());
  }

  private articleAction(
    slug: string,
    newArticle: INewArticle | IUpdateArticle
  ) {
    const subscription: Observable<IArticle> = this.isEditMode
      ? this.articlesService.updateArticle(slug, newArticle as IUpdateArticle)
      : this.articlesService.createArticle(newArticle as INewArticle);

    subscription
      .pipe(
        takeUntil(this.notifier),
        catchError((err: string) => this.onCatchError(err))
      )
      .subscribe(({ slug }: IArticle) => {
        if (!this.error) {
          this.articleForm.reset();
          this.redirectionService.redirectByUrl(`article/${slug}`);
        }
      });
  }

  private onCatchError(error: string): Observable<IArticle> {
    this.error = error;
    this.isLoading = false;
    this.articleForm.enable();

    if (error === 'Article with this title already exists') {
      this.articleForm.controls['title'].setErrors({
        notUnique: true,
      });
    }

    return of({} as IArticle);
  }

  public isDataSaved(): boolean {
    return !this.articleForm.dirty;
  }
}

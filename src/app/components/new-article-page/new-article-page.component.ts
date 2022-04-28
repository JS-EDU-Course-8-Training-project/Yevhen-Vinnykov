import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil, Observable, catchError } from 'rxjs';
import { INewArticle } from '../../shared/models/INewArticle';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IArticle } from 'src/app/shared/models/IArticle';
import { ISavedData } from 'src/app/shared/models/ISavedData';
import { ICreatedArticle } from 'src/app/shared/models/ICreatedArticle';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';

@Component({
  selector: 'app-new-article-page',
  templateUrl: './new-article-page.component.html',
  styleUrls: ['./new-article-page.component.scss']
})

export class NewArticlePageComponent implements OnInit, OnDestroy, ISavedData {
  public articleForm!: FormGroup;
  public isEditMode: boolean = this.router.url !== '/create-article';
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
    if (this.isEditMode) {
      this.slug = this.router.url.split('/')[2];
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
    this.initializeForm();
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
      tagList: [this.articleToEdit?.tagList.join(',') || '', [Validators.required]],
    });
  }

  private onCatchError(error: HttpErrorResponse): void {
    console.error(error);
  }
  
  public checkIfValid(formControl: string): boolean {
    return !(this.articleForm.get(formControl)?.touched && this.articleForm.get(formControl)?.invalid);
  }

  private createArticleData(): INewArticle {
    return {
      title: this.articleForm.getRawValue().title.trim(),
      description: this.articleForm.getRawValue().description.trim(),
      body: this.articleForm.getRawValue().body.trim(),
      tagList: this.articleForm.getRawValue().tagList.split(',').map((tag: string) => tag.trim()),
    };
  }

  public handleArticleAction(): void {
    if (this.articleForm.valid) {
      this.articleAction(this.slug, this.createArticleData());
      this.articleForm.reset();
    }
  }

  private articleAction(slug: string, newArticle: INewArticle) {
    const subscription: Observable<ICreatedArticle | HttpErrorResponse> = this.isEditMode
      ? this.articlesService.updateArticle(slug, newArticle)
      : this.articlesService.createArticle(newArticle);
    subscription
      .pipe(takeUntil(this.notifier))
      .subscribe((article: ICreatedArticle | any) => {
        this.redirectionService.redirectByUrl(`article/${article.article.slug}`);
      });
  }

  public isDataSaved(): boolean {
    return !this.articleForm.dirty;
  }
}

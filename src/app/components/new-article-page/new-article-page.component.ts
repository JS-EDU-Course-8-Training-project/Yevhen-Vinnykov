import { Subject, takeUntil } from 'rxjs';
import { INewArticle } from '../../shared/models/INewArticle';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IArticle } from 'src/app/shared/models/IArticle';
import { ISavedData } from 'src/app/shared/models/ISavedData';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.slug = this.router.url.split('/')[2];
      this.articlesService.fetchArticle(this.slug)
        .pipe(takeUntil(this.notifier))
        .subscribe(article => {
          this.articleToEdit = article;
          this.initializeForm();
          this.articleForm.markAllAsTouched();
          return;
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

  checkIfValid(formControl: string): boolean {
    return !(this.articleForm.get(formControl)?.touched && this.articleForm.get(formControl)?.invalid);
  }

  public handleArticleAction(): void {
    const newArticle: INewArticle = {
      title: this.articleForm.getRawValue().title.trim(),
      description: this.articleForm.getRawValue().description.trim(),
      body: this.articleForm.getRawValue().body.trim(),
      tagList: this.articleForm.getRawValue().tagList.split(',').map((tag: string) => tag.trim()),
    };
    if (this.articleForm.valid && !this.isEditMode) {
      this.createArticle(newArticle);
      this.articleForm.reset();
    } else {
      this.updateArticle(this.slug, newArticle);
      this.articleForm.reset();
    }
  }

  private createArticle(newArticle: INewArticle): void {
    this.articlesService.createArticle(newArticle)
      .pipe(takeUntil(this.notifier))
      .subscribe((article: any) => {
        this.router.navigateByUrl(`article/${article.article.slug}`);
      });
  }

  private updateArticle(slug: string, newArticle: INewArticle): void {
    this.articlesService.updateArticle(this.slug, newArticle)
      .pipe(takeUntil(this.notifier))
      .subscribe((article: any) => {
        this.router.navigateByUrl(`article/${article.article.slug}`);
      });
  }

  public isDataSaved(): boolean {
    return !this.articleForm.dirty;
  }
}

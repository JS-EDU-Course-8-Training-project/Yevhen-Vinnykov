import { IUpdateArticle } from 'src/app/shared/models/IUpdateArticle';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
  implements OnInit, ISavedData
{
  public articleForm!: FormGroup;
  public error!: string;
  public isLoading = false;

  public articleToEdit!: IArticle | null;
  public isEditMode = this.router.url !== '/create-article';
  public slug = this.isEditMode ? this.router.url.split('/')[2] : '';

  constructor(
    private articlesService: ArticlesService,
    private fb: FormBuilder,
    private router: Router,
    private redirectionService: RedirectionService
  ) {
    super();
  }

  get tags() {
    return (<FormArray>this.articleForm.controls['tagList']).controls;
  }

  ngOnInit(): void {
    this.initializeForm();

    if (this.isEditMode) {
      this.setArticleData();
    }
  }

  private initializeForm(): void {
    this.articleForm = this.fb.group({
      title: [this.articleToEdit?.title || '', [Validators.required]],
      description: [
        this.articleToEdit?.description || '',
        [Validators.required],
      ],
      body: [this.articleToEdit?.body || '', [Validators.required]],
      image: [this.articleToEdit?.image || ''],
      tagList: this.initializeTagsFormArray(),
    });
  }

  private async setArticleData(): Promise<void> {
    try {
      this.articleForm.disable();
      this.articleToEdit = await this.articlesService.fetchArticle(this.slug);
      this.articleForm.enable();

      this.initializeForm();
      this.articleForm.markAllAsTouched();
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private initializeTagsFormArray(): FormArray {
    const tagList = new FormArray([]);

    if (!this.articleToEdit?.tagList?.length) {
      const tagForm = this.fb.group({ tag: [''] });
      tagList.push(tagForm);
      return tagList;
    }

    for (const tag of this.articleToEdit.tagList) {
      const tagForm = this.fb.group({ tag: [tag] });
      tagList.push(tagForm);
    }

    return tagList;
  }

  public onAddTag(): void {
    (<FormArray>this.articleForm.get('tagList')).push(
      this.fb.group({ tag: [''] })
    );
  }

  public onDeleteTag(i: number): void {
    (<FormArray>this.articleForm.get('tagList')).removeAt(i);
  }

  public checkIfValid(formControl: string): boolean {
    return !(
      this.articleForm.controls[formControl].touched &&
      this.articleForm.controls[formControl].invalid
    );
  }

  public handleSubmit(): void {
    this.error = '';
    this.articleForm.disable();
    this.isLoading = true;

    if (this.isEditMode) {
      this.updateArticle(this.getDataForSubmit() as IUpdateArticle);
      return;
    }

    this.createArticle(this.getDataForSubmit() as INewArticle);
  }

  private getDataForSubmit(): INewArticle | IUpdateArticle {
    const formData = this.articleForm.getRawValue();

    formData.tagList = formData.tagList
      .map(({ tag }: { tag: string }) => tag)
      .filter((tag: string) => tag); // filter out empty tags

    const submitData = {} as INewArticle | IUpdateArticle;

    Object.keys(formData).forEach((key) => {
      const isFieldChanged =
        this.articleToEdit?.[key as keyof IUpdateArticle] !== formData[key];
      if (isFieldChanged) {
        submitData[key as keyof IUpdateArticle] = formData[key];
      }
    });

    return submitData;
  }

  private async createArticle(articleData: INewArticle): Promise<void> {
    try {
      const { slug } = await this.articlesService.createArticle(articleData);

      this.articleForm.reset();
      this.redirectionService.redirectByUrl(`article/${slug}`);
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private async updateArticle(articleData: IUpdateArticle): Promise<void> {
    try {
      const { slug } = await this.articlesService.updateArticle(
        this.slug,
        articleData
      );

      this.articleForm.reset();
      this.redirectionService.redirectByUrl(`article/${slug}`);
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private onCatchError(error: string): void {
    this.error = error;
    this.isLoading = false;
    this.articleForm.enable();
  }

  public isDataSaved(): boolean {
    return !this.articleForm.dirty;
  }
}

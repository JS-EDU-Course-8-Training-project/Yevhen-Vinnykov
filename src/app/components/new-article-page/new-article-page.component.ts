import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ArticlesService } from 'src/app/services/articles.service';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IArticle } from 'src/app/models/IArticle';

@Component({
  selector: 'app-new-article-page',
  templateUrl: './new-article-page.component.html',
  styleUrls: ['./new-article-page.component.scss']
})
export class NewArticlePageComponent implements OnInit {
  public articleForm: any;
  public isEditMode: boolean = this.router.url !== '/create-article';
  public articleToEdit!: IArticle | null;
  public slug!: string | null;
  constructor(
    private articlesService: ArticlesService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.slug = this.router.url.split('/')[2];
      this.articlesService.fetchArticle(this.slug).subscribe(article => {
        this.articleToEdit = article;
        this.articleForm = this.fb.group({
          title: [this.articleToEdit?.title, [Validators.required]],
          description: [this.articleToEdit?.description, [Validators.required]],
          body: [this.articleToEdit?.body, [Validators.required]],
          tagList: [this.articleToEdit?.tagList.join(','), [Validators.required]],
        });
      });
      return;   // needs DRY refactoring
    }
    this.articleForm = this.fb.group({
      title: [this.articleToEdit?.title, [Validators.required]],
      description: [this.articleToEdit?.description, [Validators.required]],
      body: [this.articleToEdit?.body, [Validators.required]],
      tagList: [this.articleToEdit?.tagList.join(',')],
    });
  }

  checkIfValid(formControl: string): boolean {
    return !(this.articleForm.get(formControl).touched && this.articleForm.get(formControl).invalid);
  }

  public createArticle(): void { 
    const newArticle = {
      title: this.articleForm.getRawValue().title,
      description: this.articleForm.getRawValue().description,
      body: this.articleForm.getRawValue().body,
      tagList: this.articleForm.getRawValue().tagList.split(','),
    };
    if (this.articleForm.status === 'VALID') {
      this.articlesService.createArticle(newArticle).subscribe((article: any) => {
        this.router.navigateByUrl(`article/${article.article.slug}`);
      });
    }
  }
}

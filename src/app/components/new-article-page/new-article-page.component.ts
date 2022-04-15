import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ArticlesService } from 'src/app/services/articles.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-new-article-page',
  templateUrl: './new-article-page.component.html',
  styleUrls: ['./new-article-page.component.scss']
})
export class NewArticlePageComponent implements OnInit {
  public articleForm: any;
  constructor(private articlesService: ArticlesService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      body: ['', [Validators.required]],
      tagList: [''],
    });
  }


  checkIfValid(formControl: string): boolean {
    return !(this.articleForm.get(formControl).touched && this.articleForm.get(formControl).invalid);
  }


  public createArticle(): void { // needs authorization 
    const newArticle = {
      title: this.articleForm.getRawValue().title,
      description: this.articleForm.getRawValue().description,
      body: this.articleForm.getRawValue().body,
      tagList: this.articleForm.getRawValue().tagList.split(' '),
    };
    if (this.articleForm.status === 'VALID') {
      this.articlesService.createArticle(newArticle).subscribe(article => {
        console.log(article);
      });
    } 
  }
}

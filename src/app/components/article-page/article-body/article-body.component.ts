import { IArticle } from 'src/app/shared/models/IArticle';
import { Component, Input, OnInit } from '@angular/core';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';

@Component({
  selector: 'app-article-body',
  templateUrl: './article-body.component.html',
  styleUrls: ['./article-body.component.scss']
})
export class ArticleBodyComponent implements OnInit {
  @Input() article!: IArticle;
  @Input() slug!: string;
  @Input() authUser!: IExistingUser;
  constructor() { }

  ngOnInit(): void {}

}

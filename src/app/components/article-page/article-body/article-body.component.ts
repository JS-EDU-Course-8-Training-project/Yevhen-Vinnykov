import { IArticle } from 'src/app/models/IArticle';
import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-article-body',
  templateUrl: './article-body.component.html',
  styleUrls: ['./article-body.component.scss']
})
export class ArticleBodyComponent implements OnInit {
  @Input() article!: IArticle;
  @Input() slug!: string;
  constructor() { }

  ngOnInit(): void {}

}

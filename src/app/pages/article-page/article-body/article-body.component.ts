import { IArticle } from 'src/app/shared/models/IArticle';
import { Component, Input } from '@angular/core';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-article-body',
  templateUrl: './article-body.component.html',
  styleUrls: ['./article-body.component.scss'],
})
export class ArticleBodyComponent extends TestedComponent {
  @Input() article!: IArticle;
  @Input() slug!: string;
  @Input() isAuth!: boolean;
  @Input() isMyself!: boolean;

  constructor() {
    super();
  }
}

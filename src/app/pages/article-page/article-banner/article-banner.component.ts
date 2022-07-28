import { IArticle } from 'src/app/shared/models/IArticle';
import { Component, Input } from '@angular/core';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-article-banner',
  templateUrl: './article-banner.component.html',
  styleUrls: ['./article-banner.component.scss'],
})
export class ArticleBannerComponent extends TestedComponent {
  @Input() article!: IArticle;
  @Input() isAuth!: boolean;
  @Input() isMyself!: boolean;
}

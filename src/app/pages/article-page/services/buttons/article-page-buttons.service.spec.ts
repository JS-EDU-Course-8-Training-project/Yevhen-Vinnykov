import { TestBed } from '@angular/core/testing';

import { ArticlePageButtonsService } from './article-page-buttons.service';

describe('ArticlePageButtonsService', () => {
  let service: ArticlePageButtonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlePageButtonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

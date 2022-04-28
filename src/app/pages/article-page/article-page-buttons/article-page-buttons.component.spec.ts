import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePageButtonsComponent } from './article-page-buttons.component';

describe('ArticlePageButtonsComponent', () => {
  let component: ArticlePageButtonsComponent;
  let fixture: ComponentFixture<ArticlePageButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlePageButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePageButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

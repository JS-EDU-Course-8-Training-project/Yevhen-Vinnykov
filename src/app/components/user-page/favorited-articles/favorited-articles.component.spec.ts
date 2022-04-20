import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritedArticlesComponent } from './favorited-articles.component';

describe('FavoritedArticlesComponent', () => {
  let component: FavoritedArticlesComponent;
  let fixture: ComponentFixture<FavoritedArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritedArticlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritedArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

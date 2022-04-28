import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggedArticlesComponent } from './tagged-articles.component';

describe('TaggedArticlesComponent', () => {
  let component: TaggedArticlesComponent;
  let fixture: ComponentFixture<TaggedArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaggedArticlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggedArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

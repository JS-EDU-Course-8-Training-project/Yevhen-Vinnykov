import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteButtonsComponent } from './favorite-buttons.component';

describe('FavoriteButtonsComponent', () => {
  let component: FavoriteButtonsComponent;
  let fixture: ComponentFixture<FavoriteButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

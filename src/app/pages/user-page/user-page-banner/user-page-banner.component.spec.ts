import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageBannerComponent } from './user-page-banner.component';

describe('UserPageBannerComponent', () => {
  let component: UserPageBannerComponent;
  let fixture: ComponentFixture<UserPageBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPageBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

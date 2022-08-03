import { IExistingUser } from './../../../shared/models/IExistingUser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

import { UserPageBannerComponent } from './user-page-banner.component';
import { of } from 'rxjs';
import { ProfilesService } from 'src/app/shared/services/profiles/profiles.service';

const userMock: IExistingUser = {
  id: '1',
  email: 'test-user@example.com',
  password: 'test-password',
  image: '',
  username: 'John',
};

class AuthServiceMock {
  public authUser$ = { getValue: () => userMock };
}

class RouterMock {
  public events = of(NavigationEnd);
}

class RouteMock {
  public snapshot = { params: { 'user-name': 'John' } };
}

class ProfilesServiceMock {
  public fetchUser = () => new Promise((resolve) => resolve(userMock));
}

describe('UserPageBannerComponent', () => {
  let component: UserPageBannerComponent;
  let fixture: ComponentFixture<UserPageBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPageBannerComponent],
      providers: [
        { provide: AuthorizationService, useClass: AuthServiceMock },
        { provide: Router, useClass: RouterMock },
        { provide: ActivatedRoute, useClass: RouteMock },
        { provide: ProfilesService, useClass: ProfilesServiceMock },
      ],
    }).compileComponents();
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

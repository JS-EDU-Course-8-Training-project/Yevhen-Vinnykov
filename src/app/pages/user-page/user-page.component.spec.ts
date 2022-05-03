import { IProfile } from './../../shared/models/IProfile';
import { ProfilesService } from './../../shared/services/profiles/profiles.service';
import { UsersService } from './../../shared/services/users/users.service';
import { IExistingUser } from './../../shared/models/IExistingUser';
import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserPageComponent } from './user-page.component';
import { NavigationEnd, Router } from '@angular/router';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { By } from '@angular/platform-browser';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

const mockAuthUser: IExistingUser = {
  email: 'test-auth@example.com',
  username: 'test-auth-username',
  bio: 'test-auth-bio',
  image: 'test-auth-image',
  token: 'test-auth--token',
  password: 'test-auth-password'
}

const mockUser: IProfile = {
  username: 'test-username',
  bio: '',
  image: 'test-image',
  following: false
};

class UsersServiceMock {
  public authUser$ = of(mockAuthUser);
}

class ProfilesServiceMock {
  public follow = (username: string) => of({ following: true });

  public unfollow = (username: string) => of({ following: false });

  public fetchUser = (username: string) => of(mockUser);
}

class RouterMock {
  public url = 'localhost:4200/user/test-username';
  public events = of(NavigationEnd);
}

class RedirectionServiceMock {
  public redirectUnauthorized = () => new Promise<boolean>((resolve, reject) => resolve(true));
}

class AuthorizationServiceMock {
  public isAuthorized$ = of(true);
}

class AuthorizationServiceMockNotAuth {
  public isAuthorized$ = of(false);
}

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPageComponent],
      providers: [
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: ProfilesService, useClass: ProfilesServiceMock },
        { provide: Router, useClass: RouterMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
        { provide: AuthorizationService, useClass: AuthorizationServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should follow a user', waitForAsync(() => {
    const spy = spyOn<any>(component, 'followingHandler').and.callThrough();
    const followButton = fixture.debugElement.query(By.css('[data-angular="test-follow-button"]'));
    expect(followButton.nativeElement.innerText).toBe('Follow test-username');
    expect(component.isFollowed).toBe(false);
    followButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isFollowed).toBe(true);
      expect(followButton.nativeElement.innerText).toBe('Unfollow test-username');
      expect(spy).toHaveBeenCalledWith('test-username', 'follow');
    })
  }));

  it('should unfollow a user', waitForAsync(() => {
    const spy = spyOn<any>(component, 'followingHandler').and.callThrough();
    const followButton = fixture.debugElement.query(By.css('[data-angular="test-follow-button"]'));
    followButton.triggerEventHandler('click', null);
    expect(component.isFollowed).toBe(true);
    followButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.isFollowed).toBe(false);
      expect(followButton.nativeElement.innerText).toBe('Follow test-username');
      expect(spy).toHaveBeenCalledWith('test-username', 'unfollow');
    })
  }));

});


describe('RedirectUnauthorized', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPageComponent],
      providers: [
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: ProfilesService, useClass: ProfilesServiceMock },
        { provide: Router, useClass: RouterMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
        { provide: AuthorizationService, useClass: AuthorizationServiceMockNotAuth }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be invoked', () => {
    const spy = spyOn<any>(component, 'redirectUnauthorized');
    const followButton = fixture.debugElement.query(By.css('[data-angular="test-follow-button"]'));
    followButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

});

describe('UserPageComponent Myself Mode', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;

  class RouterMock {
    public url = 'localhost:4200/user/test-auth-username';
    public events = of(NavigationEnd);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPageComponent],
      providers: [
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: ProfilesService, useClass: ProfilesServiceMock },
        { provide: Router, useClass: RouterMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
        { provide: AuthorizationService, useClass: AuthorizationServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize correctly', () => {
    const followButton = fixture.debugElement.query(By.css('[data-angular="test-follow-button"]'));
    expect(component.isMyself).toBe(true);
    expect(followButton).toBeFalsy();
  });

});

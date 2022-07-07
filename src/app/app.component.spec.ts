import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthorizationService } from './shared/services/authorization/authorization.service';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { UsersService } from './shared/services/users/users.service';
import { NavbarUserComponent } from './components/navbar/navbar-user/navbar-user.component';
import { IExistingUser } from './shared/models/IExistingUser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

class AuthorizationServiceMock {
  public isAuthorized$ = of(true);
  public checkIfAuthorized = () => of(true);
}

class UsersServiceMock {
  public authUser$ = of({ username: 'user' });
  public fetchAuthUser = () => of({} as IExistingUser)
}

class UsersServiceMockEmpty {
  public authUser$ = {
    getValue: () => ({username: ''})
  };
  public fetchAuthUser = () => of({} as IExistingUser)
}

describe('APP COMPONENT WHEN USERS SERVICE HAS AN AUTH USER', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        NavbarComponent,
        NavbarUserComponent,
        HeaderComponent,
      ],
      providers: [
        { provide: AuthorizationService, useClass: AuthorizationServiceMock },
        { provide: UsersService, useClass: UsersServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call initialize method but not trigger UsersService subscription', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const spy = spyOn<any>(app, 'initialize').and.callThrough();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

});

describe('APP COMPONENT WHEN USERS SERVICE DOES NOT HAVE AN AUTH USER', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
      ],
      providers: [
        { provide: AuthorizationService, useClass: AuthorizationServiceMock },
        { provide: UsersService, useClass: UsersServiceMockEmpty }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should call initialize method and trigger UsersService subscription', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const spy = spyOn<any>(app, 'initialize').and.callThrough();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
  
});
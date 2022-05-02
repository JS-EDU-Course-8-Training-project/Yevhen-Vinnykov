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

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        NavbarComponent,
        NavbarUserComponent,
      ],
      providers: [
        {
          provide: AuthorizationService, useValue: {
          isAuthorized$: of(true),
          checkIfAuthorized: () => of(true)
        }
      }, 
      {
        provide: UsersService, useValue: {
          authUser$: of({username: 'user'}),
          fetchAuthUser: () => of({} as IExistingUser)
        }
      }
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  it('should call initialize method', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const spy = spyOn<any>(app, 'initialize').and.callThrough();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});






describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        NavbarComponent,
        NavbarUserComponent,
      ],
      providers: [
        {
          provide: AuthorizationService, useValue: {
          isAuthorized$: of(true),
          checkIfAuthorized: () => of(true)
        }
      }, 
      {
        provide: UsersService, useValue: {
          authUser$: of({} as IExistingUser),
          fetchAuthUser: () => of({} as IExistingUser)
        }
      }
      ],
    }).compileComponents();
  });

  it('should call initialize method', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const spy = spyOn<any>(app, 'initialize').and.callThrough();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});

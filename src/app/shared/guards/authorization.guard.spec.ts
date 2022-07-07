import { AuthorizationService } from './../services/authorization/authorization.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { AuthorizationGuard } from './authorization.guard';

class AuthorizationServiceMockNotAuth {
  public isAuthorized$ = of(false);
}

class AuthorizationServiceMock {
  public isAuthorized$ = of(true);
}

describe('AUTHORIZATION GUARD > UNAUTHORIZED', () => {
  let guard: any;
  let authorizationService: AuthorizationServiceMockNotAuth;
  let routeMock: any = { snapshot: {} };
  let routeStateMock: any = { snapshot: {}, url: '/create-article' };
  let routerMock = { createUrlTree: jasmine.createSpy('navigate') }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthorizationGuard,
        { provide: AuthorizationService, useClass: AuthorizationServiceMockNotAuth },
        { provide: Router, useValue: routerMock }
      ],
      imports: [HttpClientTestingModule]
    });
    guard = TestBed.inject(AuthorizationGuard);
    authorizationService = TestBed.inject(AuthorizationService);
  });

  it('should redirect an unauthorized user to the login route', waitForAsync(() => {
    guard.canActivate(routeMock, routeStateMock).subscribe(() => {
      expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/sign-in']);
    });
  }));
});


describe('AUTHORIZATION GUARD > AUTHORIZED', () => {
  let guard: any;
  let authorizationService: AuthorizationServiceMock;
  let routeMock: any = { snapshot: {} };
  let routeStateMock: any = { snapshot: {}, url: '/create-article' };
  let routerMock = { createUrlTree: jasmine.createSpy('navigate') }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthorizationGuard,
        { provide: AuthorizationService, useClass: AuthorizationServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      imports: [HttpClientTestingModule]
    });
    guard = TestBed.inject(AuthorizationGuard);
    authorizationService = TestBed.inject(AuthorizationService);
  });

  it('should allow the authenticated user to access new article page', waitForAsync(() => {
    guard.canActivate(routeMock, routeStateMock).subscribe((res: boolean) => {
      expect(res).toBe(true);
    });
  }));
});
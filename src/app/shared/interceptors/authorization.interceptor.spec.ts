import { AuthorizationService } from './../services/authorization/authorization.service';
import { BehaviorSubject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthorizationInterceptor } from './authorization.interceptor';
import { MockDataService } from './mock-data-service.service';

class AuthorizationServiceMock {
  public checkIfAuthorized = () => ({});
  public isAuthorized$ = new BehaviorSubject<boolean>(true);
}

class AuthorizationServiceMockNotAuth {
  public checkIfAuthorized = () => ({});
  public isAuthorized$ = new BehaviorSubject<boolean>(false);
}

describe('AUTHORIZATION INERCEPTOR > ADDING AUTHORIZATION', () => {
  let httpMock: HttpTestingController;
  let service: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthorizationInterceptor,
        MockDataService,
        { provide: AuthorizationService, useClass: AuthorizationServiceMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthorizationInterceptor,
          multi: true,
        },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MockDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should add an Authorization header', () => {
    service.getPosts().subscribe((response) => {
      expect(response).toBeTruthy();
    });
    const httpRequest = httpMock.expectOne(`${service.ROOT_URL}/posts`);
    expect(httpRequest.request.url).toBe(`${service.ROOT_URL}/posts`);
    expect(httpRequest.request.headers.has('x-access-token')).toBeTrue();
  });
});

describe('AUTHORIZATION INERCEPTOR > NOT ADDING AUTHORIZATION', () => {
  let httpMock: HttpTestingController;
  let service: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthorizationInterceptor,
        MockDataService,
        {
          provide: AuthorizationService,
          useClass: AuthorizationServiceMockNotAuth,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthorizationInterceptor,
          multi: true,
        },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MockDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should not add an authorization header', () => {
    service.getPosts().subscribe((response) => {
      expect(response).toBeTruthy();
    });
    const httpRequest = httpMock.expectOne(`${service.ROOT_URL}/posts`);
    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
  });
});

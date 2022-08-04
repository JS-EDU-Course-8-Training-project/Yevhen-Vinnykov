import { AuthorizationService } from './../services/authorization/authorization.service';
import { BehaviorSubject, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HttpErrorResponse,
  HttpEventType,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

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

////////////////////////////////////////////////////////////////

const mockError: HttpErrorResponse = {
  error: {
    errors: {
      'Error: ': ['is wrong'],
    },
  },
  name: 'HttpErrorResponse',
  message: '',
  ok: false,
  headers: new HttpHeaders(),
  status: 0,
  statusText: '',
  url: null,
  type: HttpEventType.ResponseHeader,
};

describe('AUTHORIZATION INERCEPTOR > ERROR HANDLING', () => {
  let interceptor: AuthorizationInterceptor;
  let httpRequestSpy: jasmine.SpyObj<HttpRequest<any>>;
  let httpHandlerSpy: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthorizationInterceptor,
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
    interceptor = TestBed.inject(AuthorizationInterceptor);
    httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
    httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
  });

  it('should return server side error', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(() => mockError));
    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      next: (result) => console.log('good', result),
      error: (errorMessage) => {
        expect(errorMessage).toBe('is wrong');
      },
    });
  });

  it('should return client side error', () => {
    const mockError = {
      error: { message: new ErrorEvent('Error') },
    };
    httpHandlerSpy.handle.and.returnValue(throwError(() => mockError));
    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      next: (result) => console.log('good', result),
      error: (errorMessage) => {
        expect(errorMessage).toBe('Something went wrong :(');
      },
    });
  });
});

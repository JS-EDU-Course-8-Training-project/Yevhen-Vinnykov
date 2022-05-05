import { AuthorizationService } from './../services/authorization/authorization.service';
import { BehaviorSubject, catchError, of, throwError } from 'rxjs';
import { TestBed, waitForAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpHeaders, HttpEventType, HttpErrorResponse } from '@angular/common/http';

import { AuthorizationInterceptor } from './authorization.interceptor';
import { MockDataService } from './mock-data-service.service';

class AuthorizationServiceMock {
  public checkIfAuthorized = () => { }
  public isAuthorized$ = new BehaviorSubject<boolean>(true);
}

class AuthorizationServiceMockNotAuth {
  public checkIfAuthorized = () => { }
  public isAuthorized$ = new BehaviorSubject<boolean>(false);
}


describe('AuthorizationInterceptor', () => {
  let interceptor: AuthorizationInterceptor;
  let httpMock: HttpTestingController;
  let service: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthorizationInterceptor,
        MockDataService,
        { provide: AuthorizationService, useClass: AuthorizationServiceMock },
        { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true }
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    interceptor = TestBed.inject(AuthorizationInterceptor);
    service = TestBed.inject(MockDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should add an Authorization header', waitForAsync(() => {
    service.getPosts().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const httpRequest = httpMock.expectOne(`${service.ROOT_URL}/posts`);
    expect(httpRequest.request.url).toBe(`${service.ROOT_URL}/posts`);
    expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
  }));

});

describe('AuthorizationInterceptor', () => {
  let interceptor: AuthorizationInterceptor;
  let httpMock: HttpTestingController;
  let service: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthorizationInterceptor,
        MockDataService,
        { provide: AuthorizationService, useClass: AuthorizationServiceMockNotAuth },
        { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true }
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    interceptor = TestBed.inject(AuthorizationInterceptor);
    service = TestBed.inject(MockDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should not add an Authorization header', waitForAsync(() => {
    service.getPosts().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const httpRequest = httpMock.expectOne(`${service.ROOT_URL}/posts`);
    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
  }));

});


///////////////////////////////////////////ERROR/////////////////////////////////////////////////////

const mockError: HttpErrorResponse = {
  error: {
    errors: {
      'email': ['is wrong']
    }
  },
  name: 'HttpErrorResponse',
  message: '',
  ok: false,
  headers: new HttpHeaders,
  status: 0,
  statusText: '',
  url: null,
  type: HttpEventType.ResponseHeader
};

class MockDataServiceWithError {
  public ROOT_URL = `http://jsonplaceholder.typicode.com`;
  public getPosts = () => throwError(() => mockError);
}

describe('AuthorizationInterceptor ERROR', () => {
  let interceptor: AuthorizationInterceptor;
  let httpMock: HttpTestingController;
  let service: MockDataServiceWithError;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthorizationInterceptor,
        { provide: MockDataServiceWithError, useClass: MockDataServiceWithError },
        { provide: AuthorizationService, useClass: AuthorizationServiceMockNotAuth },
        { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true }
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    interceptor = TestBed.inject(AuthorizationInterceptor);
    service = TestBed.inject(MockDataServiceWithError);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should return error', () => {
    let httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
    let httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(throwError(() => mockError));
    interceptor.intercept(httpRequestSpy, httpHandlerSpy)
      .subscribe({
        next: result => console.log('good', result),
        error: err => {
          console.log('error', err);
          expect(err).toEqual(mockError);
        }
      });
  })
});


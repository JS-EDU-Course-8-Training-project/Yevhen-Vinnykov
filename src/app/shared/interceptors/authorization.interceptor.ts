import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthorizationService } from '../services/authorization/authorization.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  private isAuthorized = false;

  constructor(readonly authorizationService: AuthorizationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.authorizationService.checkIfAuthorized();
    this.isAuthorized = this.authorizationService.isAuthorized$.getValue();

    if (this.isAuthorized) {
      const token = `${localStorage.getItem('token')}`;
      request = request.clone({
        headers: request.headers.append('x-access-token', token),
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse): Observable<HttpEvent<string>> => {
        let errorMsg = 'Something went wrong :(';
        if (error.error instanceof ErrorEvent) {
          console.log('This is client side error');
          errorMsg = `Error: ${error.error.message}`;
        } else {
          console.log('This is server side error');
          errorMsg = error.error?.errors?.['Error: '][0] || errorMsg;
        }

        return throwError(() => errorMsg);
      })
    );
  }
}

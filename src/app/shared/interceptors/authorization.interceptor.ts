import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthorizationService } from '../services/authorization/authorization.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  private isAuthorized: boolean = false;

  constructor(
    readonly authorizationService: AuthorizationService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.authorizationService.checkIfAuthorized();
    this.isAuthorized = this.authorizationService.isAuthorized$.getValue();
    if (this.isAuthorized) {
      //const token: string = `Bearer ${localStorage.getItem('token')}`;
      const token: string = `${localStorage.getItem('token')}`;
      request = request.clone({
       // headers: request.headers.append('Authorization', token)
       headers: request.headers.append('x-access-token', token)
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse): Observable<HttpEvent<unknown>> => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          console.log('This is client side error');
          errorMsg = `Error: ${error.error.message}`;
        } else {
          console.log('This is server side error');
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        console.log(errorMsg);
        return throwError(() => error);
      })
    );
  }
}

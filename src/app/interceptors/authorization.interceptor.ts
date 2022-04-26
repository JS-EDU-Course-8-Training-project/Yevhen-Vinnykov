import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  private isAuthorized: boolean = false;

  constructor(
    readonly authorizationService: AuthorizationService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.authorizationService.checkIfAuthorized();
    this.isAuthorized = this.authorizationService.isAuthorized$.getValue();
      if(this.isAuthorized){
        const token: string = `Bearer ${localStorage.getItem('token')}`;
        const authorizedRequest = request.clone({
          headers: request.headers.append('Authorization', token)
        });
        return next.handle(authorizedRequest);
      }
    return next.handle(request);
  }
}

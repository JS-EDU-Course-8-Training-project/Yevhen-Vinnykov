import { IUpdateUser } from './../../models/IUpdateUser';
import { environment } from '../../../../environments/environment';
import { IExistingUser } from '../../models/IExistingUser';
import { Observable, pluck, map } from 'rxjs';
import { INewUser } from '../../models/INewUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationService } from '../authorization/authorization.service';

const httpOptions = {
  headers: new HttpHeaders({
    accept: 'application/json',
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseURL: string = environment.apiURL;

  constructor(
    private http: HttpClient,
    private authorizationService: AuthorizationService
  ) {}

  public createUser(user: INewUser): Observable<IExistingUser> {
    return this.http
      .post<{ user: IExistingUser }>(
        `${this.baseURL}/users/signup`,
        { user },
        httpOptions
      )
      .pipe(
        pluck('user'),
        map((user) => {
          this.authorizationService.authorize(user);
          return user;
        })
      );
  }

  public updateUser(settings: IUpdateUser): Observable<IExistingUser> {
    return this.http
      .put<{ user: IExistingUser }>(
        `${this.baseURL}/users`,
        { user: { ...settings } },
        httpOptions
      )
      .pipe(
        pluck('user'),
        map((user) => {
          this.authorizationService.authorize(user);
          return user;
        })
      );
  }
}

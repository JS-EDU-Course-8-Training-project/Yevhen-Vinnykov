import { IUpdateUser } from './../../models/IUpdateUser';
import { environment } from '../../../../environments/environment';
import { IExistingUser } from '../../models/IExistingUser';
import { IUserData } from '../../models/IUserData';
import { Observable, pluck, map, BehaviorSubject } from 'rxjs';
import { INewUser } from '../../models/INewUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationService } from '../authorization/authorization.service';
import { Router } from '@angular/router';

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
  private tokenExpirationDuration: number = 3600 * 1000;
  private tokenExpirationTimerId!: number | null;

  public authUser$: BehaviorSubject<IExistingUser> =
    new BehaviorSubject<IExistingUser>({
      id: '',
      email: '',
      username: '',
      bio: '',
      image: '',
    });

  constructor(
    private http: HttpClient,
    private authorizationService: AuthorizationService,
    private router: Router
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
          this.authorizationHelper(user);
          return user;
        })
      );
  }

  public signIn(user: IUserData): Observable<IExistingUser> {
    return this.http
      .post<{ user: IExistingUser }>(
        `${this.baseURL}/users/login`,
        JSON.stringify({ user }),
        httpOptions
      )
      .pipe(
        pluck('user'),
        map((user) => {
          this.authorizationHelper(user);
          return user;
        })
      );
  }

  public fetchAuthUser(): Observable<IExistingUser> {
    return this.http
      .get<{ user: IExistingUser }>(`${this.baseURL}/users`, httpOptions)
      .pipe(
        pluck('user'),
        map((user) => {
          this.authUser$.next(user);
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
          this.authorizationHelper(user);
          return user;
        })
      );
  }

  public signOut(): void {
    this.authorizationService.removeAuthorization();
    this.authUser$.next({} as IExistingUser);
    if (this.tokenExpirationTimerId) {
      clearTimeout(this.tokenExpirationTimerId);
      this.tokenExpirationTimerId = null;
    }
    this.router.navigateByUrl('/sign-in');
  }

  private autoSignOut(expirationDate: number): void {
    if (this.tokenExpirationTimerId) clearTimeout(this.tokenExpirationTimerId);
    this.tokenExpirationTimerId = window.setTimeout(
      () => this.signOut(),
      expirationDate
    );
  }

  private authorizationHelper(user: IExistingUser) {
    if (user.token) {
      this.authorizationService.authorize(user.token);
      this.autoSignOut(this.tokenExpirationDuration);
    }
    this.authUser$.next(user);
  }
}

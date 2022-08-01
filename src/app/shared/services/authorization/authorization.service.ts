import { IUserData } from 'src/app/shared/models/IUserData';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { BehaviorSubject, firstValueFrom, Observable, pluck, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    accept: 'application/json',
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  constructor(private http: HttpClient, private router: Router) {}

  private baseURL: string = environment.apiURL;
  private tokenExpirationDuration: number = 3600 * 1000;
  private tokenExpirationTimerId!: number | null;
  public isAuthorized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public authUser$: BehaviorSubject<IExistingUser> =
    new BehaviorSubject<IExistingUser>({
      id: '',
      email: '',
      username: '',
      bio: '',
      image: '',
    });

  public signIn(user: IUserData): Promise<IExistingUser> {
    const source$ = this.http
      .post<{ user: IExistingUser }>(
        `${this.baseURL}/users/login`,
        { user },
        httpOptions
      )
      .pipe(
        pluck('user'),
        tap((user) => {
          this.authorize(user);
          return user;
        })
      );

    return firstValueFrom(source$);
  }

  public fetchAuthUser(): Observable<IExistingUser> {
    return this.http
      .get<{ user: IExistingUser }>(`${this.baseURL}/users`, httpOptions)
      .pipe(
        pluck('user'),
        tap((user) => {
          this.authorize(user);
          return user;
        })
      );
  }

  public signOut(): void {
    this.removeAuthorization();

    if (this.tokenExpirationTimerId) {
      clearTimeout(this.tokenExpirationTimerId);
      this.tokenExpirationTimerId = null;
    }

    this.router.navigateByUrl('/sign-in');
  }

  private autoSignOut(expirationDuration: number): void {
    if (this.tokenExpirationTimerId) clearTimeout(this.tokenExpirationTimerId);

    this.tokenExpirationTimerId = window.setTimeout(
      () => this.signOut(),
      expirationDuration
    );
  }

  public checkIfAuthorized(): void {
    const isAuth: boolean = localStorage.getItem('authorized') === 'true';
    this.isAuthorized$.next(isAuth);
  }

  public authorize(user: IExistingUser): void {
    if (!user.token) return;

    localStorage.setItem('authorized', 'true');
    localStorage.setItem('token', user.token);

    this.isAuthorized$.next(true);
    this.authUser$.next(user);

    this.autoSignOut(this.tokenExpirationDuration);
  }

  public removeAuthorization(): void {
    localStorage.removeItem('authorized');
    localStorage.removeItem('token');

    this.isAuthorized$.next(false);
    this.authUser$.next({} as IExistingUser);
  }
}

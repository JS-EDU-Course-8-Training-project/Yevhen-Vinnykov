import { environment } from '../../../../environments/environment';
import { IExistingUser } from '../../models/IExistingUser';
import { IUserData } from '../../models/IUserData';
import { Observable, of, pluck, map, BehaviorSubject, filter } from 'rxjs';
import { INewUser } from '../../models/INewUser';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationService } from '../authorization/authorization.service';


const httpOptions = {
  headers: new HttpHeaders({
    'accept': 'application/json',
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseURL: string = environment.apiURL;
  public authUser$: BehaviorSubject<IExistingUser> = new BehaviorSubject<IExistingUser>({
    email: '',
    username: '',
    bio: '',
    image: '',
  });

  constructor(
    private http: HttpClient,
    private authorizationService: AuthorizationService
  ) { }

  public createUser(user: INewUser): Observable<IExistingUser | HttpErrorResponse> {
    return this.http
      .post<{ user: IExistingUser }>(`${this.baseURL}/users`, JSON.stringify({ user }), httpOptions).pipe(
        pluck('user'),
        map(user => {
          this.authorizationHelper(user);
          return user;
        })
      );
  }

  public signIn(user: IUserData): Observable<IExistingUser | HttpErrorResponse> {
    return this.http
      .post<{ user: IExistingUser }>(`${this.baseURL}/users/login`, JSON.stringify({ user }), httpOptions)
      .pipe(
        pluck('user'),
        map(user => {
          this.authorizationHelper(user);
          return user;
        }),
      );
  }

  public fetchAuthUser(): Observable<IExistingUser | HttpErrorResponse> {
    return this.http.get<{ user: IExistingUser }>(`${this.baseURL}/user`, httpOptions)
      .pipe(
        pluck('user'),
        filter(res => !(res instanceof HttpErrorResponse)),
        map(user => {
          this.authUser$.next(user);
          return user;
        }),
      );
  }

  public updateUser(settings: IExistingUser): Observable<IExistingUser | HttpErrorResponse> {
    return this.http
      .put<{ user: IExistingUser }>(`${this.baseURL}/user`, JSON.stringify({ user: { ...settings } }), httpOptions)
      .pipe(
        pluck('user'),
        map(user => {
          this.authorizationHelper(user);
          return user;
        }),
     );
  }

  public signOut(): void {
    this.authorizationService.removeAuthorization();
    this.authUser$.next({} as IExistingUser);
  }

  private authorizationHelper(user: IExistingUser) {
    if(user.token){
      this.authorizationService.authorize(user.token);
    }
    this.authUser$.next(user);
  }

}

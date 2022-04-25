import { environment } from './../../environments/environment';
import { IExistingUser } from './../models/IExistingUser';
import { IUserData } from './../models/IUserData';
import { catchError, Observable, of, pluck, throwError, map } from 'rxjs';
import { INewUser } from '../models/INewUser';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
  public authUser!: IExistingUser;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    //return throwError(() => new Error('Something bad happened; please try again later.'));
    return of(error);
  }

  createUser(user: INewUser): Observable<IExistingUser | any> {
    return this.http.post<IExistingUser | any>(`${this.baseURL}/users`, JSON.stringify({ user }), httpOptions).pipe(
      catchError((err): any => this.handleError(err))
    );
  }

  signIn(user: IUserData): Observable<IUserData | any> {
    return this.http.post<IUserData>(`${this.baseURL}/users/login`, JSON.stringify({ user }), httpOptions).pipe(
      catchError((err): any => this.handleError(err))
    );
  }

  fetchAuthUser(): Observable<IExistingUser | any> {
    return this.http.get<{ user: IExistingUser }>(`${this.baseURL}/user`, httpOptions).pipe(
      pluck('user'),
      map(user => {
        this.authUser = user;
        return user;
      }),
      catchError((err): any => this.handleError(err))
    );
  }

  updateUser(settings: IExistingUser): Observable<IExistingUser | any> {
    return this.http.put<{ user: IExistingUser }>(`${this.baseURL}/user`, JSON.stringify({ user: { ...settings } }), httpOptions).pipe(
      pluck('user'),
      catchError((err): any => this.handleError(err))
    );
  }
}

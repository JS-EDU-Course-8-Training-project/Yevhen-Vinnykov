import { IExistingUser } from './../models/IExistingUser';
import { IUserData } from './../models/IUserData';
import { catchError, Observable, of, throwError } from 'rxjs';
import { INewUser } from '../models/INewUser';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({
    'accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseURL: string = 'https://api.realworld.io/api/users';

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
    return of(error.error);
  }

  createUser(user: INewUser): Observable<IExistingUser | any> {
    return this.http.post<IExistingUser | any>(this.baseURL, JSON.stringify({ user }), httpOptions).pipe(
      catchError((err): any => this.handleError(err))
    );
  }

  signIn(user: IUserData): Observable<IUserData | any> {
    return this.http.post<IUserData>(`${this.baseURL}/login`, JSON.stringify({ user }), httpOptions).pipe(
      catchError((err): any => this.handleError(err))
    );
  }

  fetchAuthUser(): Observable<IExistingUser | any> {
    return this.http.get<IExistingUser>(this.baseURL.slice(0, this.baseURL.length - 1), httpOptions).pipe(
      catchError((err): any => this.handleError(err))
    );
  }
}

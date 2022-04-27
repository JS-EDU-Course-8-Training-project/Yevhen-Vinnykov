import { IProfile } from '../models/IProfile';
import { catchError, Observable, pluck } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'accept': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  private baseURL: string = environment.apiURL;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  public follow(username: string): Observable<IProfile | HttpErrorResponse> {
    return this.http
      .post<{ profile: IProfile }>(`${this.baseURL}/profiles/${username}/follow`, null, httpOptions)
      .pipe(
        pluck('profile'),
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public unfollow(username: string): Observable<IProfile | HttpErrorResponse> {
    return this.http
      .delete<{ profile: IProfile }>(`${this.baseURL}/profiles/${username}/follow`, httpOptions)
      .pipe(
        pluck('profile'),
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }

  public fetchUser(username: string): Observable<IProfile | HttpErrorResponse> {
    return this.http
      .get<{ profile: IProfile }>(`${this.baseURL}/profiles/${username}`, httpOptions)
      .pipe(
        pluck('profile'),
        catchError((err): Observable<HttpErrorResponse> => this.errorHandler.handleError(err))
      );
  }
}

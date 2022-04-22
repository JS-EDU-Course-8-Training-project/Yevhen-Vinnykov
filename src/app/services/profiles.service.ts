import { IProfile } from './../models/IProfile';
import { Observable, pluck } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  private baseURL: string = environment.apiURL;


  constructor(private http: HttpClient) { }
  follow(username: string): Observable<IProfile> {
    return this.http.post<{ profile: IProfile }>(`${this.baseURL}/profiles/${username}/follow`, null, httpOptions).pipe(pluck('profile'));
  }
  unfollow(username: string): Observable<IProfile> {
    return this.http.delete<{ profile: IProfile }>(`${this.baseURL}/profiles/${username}/follow`, httpOptions).pipe(pluck('profile'));
  }
  fetchUser(username: string): Observable<IProfile> {
    return this.http.get<{profile: IProfile}>(`${this.baseURL}/profiles/${username}`, httpOptions).pipe(pluck('profile'));
  }
}

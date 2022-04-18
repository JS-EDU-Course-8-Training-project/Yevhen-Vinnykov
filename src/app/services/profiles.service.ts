import { IProfile } from './../models/IProfile';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'accept': 'application/json',
    'Authorization':`Bearer ${localStorage.getItem('token')}`,
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  baseURL: string = 'https://api.realworld.io/api/profiles';

  constructor(private http: HttpClient) { }
  follow(username: string): Observable<IProfile> {
    return this.http.post<IProfile>(`${this.baseURL}/${username}/follow`, null, httpOptions);
  }
  unfollow(username: string): Observable<IProfile> {
    return this.http.delete<IProfile>(`${this.baseURL}/${username}/follow`, httpOptions);
  }
}

import { IProfile } from '../../models/IProfile';
import { firstValueFrom, pluck } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    accept: 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private baseURL: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  public follow(username: string): Promise<IProfile> {
    const source$ = this.http
      .post<{ profile: IProfile }>(
        `${this.baseURL}/profiles/${username}/follow`,
        null,
        httpOptions
      )
      .pipe(pluck('profile'));

    return firstValueFrom(source$);
  }

  public unfollow(username: string): Promise<IProfile> {
    const source$ = this.http
      .delete<{ profile: IProfile }>(
        `${this.baseURL}/profiles/${username}/follow`,
        httpOptions
      )
      .pipe(pluck('profile'));

    return firstValueFrom(source$);
  }

  public fetchUser(username: string): Promise<IProfile> {
    const source$ = this.http
      .get<{ profile: IProfile }>(
        `${this.baseURL}/profiles/${username}`,
        httpOptions
      )
      .pipe(pluck('profile'));

    return firstValueFrom(source$);
  }
}

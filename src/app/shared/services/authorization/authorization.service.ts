import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  public isAuthorized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public checkIfAuthorized(): void {
    const isAuth: boolean = localStorage.getItem('authorized') === 'true';
    this.isAuthorized$.next(isAuth);
  }

  public authorize(token: string): void {
    localStorage.setItem('authorized', 'true');
    localStorage.setItem('token', token);
    this.isAuthorized$.next(true);
  }

  public removeAuthorization(): void {
    localStorage.removeItem('authorized');
    localStorage.removeItem('token');
    this.isAuthorized$.next(false);
  }
}

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FollowButtonStore {
  readonly isFollowed$ = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
}

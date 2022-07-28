import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LikeButtonStore {
  readonly isLiked$ = new BehaviorSubject<boolean>(false);
  readonly likesCount$ = new BehaviorSubject<number>(0);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
}

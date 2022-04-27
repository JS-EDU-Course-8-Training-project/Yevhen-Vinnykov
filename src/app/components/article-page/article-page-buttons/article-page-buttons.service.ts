import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export interface IButtonsState {
  favoriteInProgress: boolean;
  followingInProgress: boolean;
  isLiked: boolean;
  isFollowed: boolean;
  likesCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArticlePageButtonsService {
  public ButtonsState$: BehaviorSubject<IButtonsState> = new BehaviorSubject<IButtonsState>({
    favoriteInProgress: false,
    followingInProgress: false,
    isLiked: false,
    isFollowed: false,
    likesCount: 0
  });

  constructor() { }

  public initialize(initialState: IButtonsState): BehaviorSubject<IButtonsState> {
    this.ButtonsState$.next(initialState);
    return this.ButtonsState$;
  }

  public setLikesCount(count: number): void {
    this.ButtonsState$.next({...this.ButtonsState$.getValue(), likesCount: count});
  }

  public setIsLiked(value: boolean): void {
    this.ButtonsState$.next({...this.ButtonsState$.getValue(), isLiked: value});
  }

  public setIsFollowed(value: boolean): void {
    this.ButtonsState$.next({...this.ButtonsState$.getValue(), isFollowed: value});
  }

  public setFavoriteInProgress(value: boolean): void {
    this.ButtonsState$.next({...this.ButtonsState$.getValue(), favoriteInProgress: value});
  }

  public setFollowingInProgress(value: boolean): void {
    this.ButtonsState$.next({...this.ButtonsState$.getValue(), followingInProgress: value});
  }
}

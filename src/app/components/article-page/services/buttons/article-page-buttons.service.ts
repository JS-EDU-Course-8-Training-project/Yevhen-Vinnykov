import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IArticle } from 'src/app/shared/models/IArticle';

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

  public createInitialState(article: IArticle): IButtonsState {
    return {
      followingInProgress: false,
      favoriteInProgress: false,
      isLiked: article?.favorited,
      isFollowed: article?.author?.following,
      likesCount: article?.favoritesCount
    };
  }

  public initialize(article: IArticle): BehaviorSubject<IButtonsState> {
    this.ButtonsState$.next(this.createInitialState(article));
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

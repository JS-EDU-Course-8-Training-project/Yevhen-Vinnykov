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

type Tfield = 'favoriteInProgress' | 'followingInProgress' | 'isLiked' | 'isFollowed' | 'likesCount';

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

  public updateState(field: Tfield, value: number | boolean): void {
    this.ButtonsState$.next({...this.ButtonsState$.getValue(), [field]: value});
  }
}

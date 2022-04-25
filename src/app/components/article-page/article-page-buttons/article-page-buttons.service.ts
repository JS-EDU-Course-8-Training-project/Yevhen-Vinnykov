import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArticlePageButtonsService {
  public favoriteInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public followingInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLiked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public likesCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public isFollowed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor() { }

  public initialize(isLiked: boolean, isFollowed: boolean, likesCount: number): void {
    this.setIsLiked(isLiked);
    this.setIsFollowed(isFollowed);
    this.setLikesCount(likesCount);
  }

  public setLikesCount(count: number): void {
    this.likesCount$.next(count);
  }

  public setIsLiked(value: boolean): void {
    this.isLiked$.next(value);
  }

  public setIsFollowed(value: boolean): void {
    this.isFollowed$.next(value);
  }

  public setFavoriteInProgress(value: boolean): void {
    this.favoriteInProgress$.next(value);
  }

  public setFollowingInProgress(value: boolean): void {
    this.followingInProgress$.next(value);
  }
}

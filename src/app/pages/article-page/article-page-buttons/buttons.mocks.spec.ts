import { of, BehaviorSubject } from 'rxjs';
import { IArticle } from 'src/app/shared/models/IArticle';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';

export interface IButtonsState {
  favoriteInProgress: boolean;
  followingInProgress: boolean;
  isLiked: boolean;
  isFollowed: boolean;
  likesCount: number;
}

export class ArticlesServiceMock {
  public addToFavorites = () =>
    of({
      ...article,
      favorited: true,
      favoritesCount: article.favoritesCount + 1,
    });

  public removeFromFavorites = () =>
    of({
      ...article,
      favorited: false,
      favoritesCount: article.favoritesCount - 1,
    });

  public deleteArticle = () => of(null);
}

export class ProfilesServiceMock {
  public follow = () => of({ following: true });

  public unfollow = () => of({ following: false });
}

export class RedirectionServiceMock {
  public redirectToEditArticle = () =>
    new Promise<boolean>((resolve) => resolve(true));

  public redirectUnauthorized = () =>
    new Promise<boolean>((resolve) => resolve(true));

  public redirectHome = () => new Promise<boolean>((resolve) => resolve(true));
}

export class ArticlePageButtonsServiceMock {
  public ButtonsState$: BehaviorSubject<IButtonsState> =
    new BehaviorSubject<IButtonsState>({
      favoriteInProgress: false,
      followingInProgress: false,
      isLiked: false,
      isFollowed: false,
      likesCount: 0,
    });

  public createInitialState = (article: IArticle): IButtonsState => {
    return {
      followingInProgress: false,
      favoriteInProgress: false,
      isLiked: article.favorited,
      isFollowed: article.author.following,
      likesCount: article.favoritesCount,
    };
  };

  public initialize(article: IArticle): BehaviorSubject<IButtonsState> {
    this.ButtonsState$.next(this.createInitialState(article));
    return this.ButtonsState$;
  }

  public updateState(field: string, value: number | boolean): void {
    this.ButtonsState$.next({
      ...this.ButtonsState$.getValue(),
      [field]: value,
    });
  }
}

export class AuthorizationServiceMock {
  public isAuthorized$ = of(true);

  public checkIfAuthorized = () => of(true);
}

export class AuthorizationServiceNotAuthMock {
  public isAuthorized$ = of(false);

  public checkIfAuthorized = () => of(false);
}

export const article: IArticle = {
  id: '1',
  slug: 'test-slug',
  title: 'test-tile',
  description: 'test-description',
  body: 'test-body',
  image: 'test-image',
  tagList: ['test-tag'],
  createdAt: Date.now().toLocaleString(),
  updatedAt: Date.now().toLocaleString(),
  favorited: false,
  favoritesCount: 2,
  author: {
    username: 'test',
    bio: 'test-bio',
    image: 'test-author',
    following: false,
  },
};

export const authUser: IExistingUser = {
  id: '1',
  email: 'test@example.com',
  username: 'test-username',
  bio: 'test-bio',
  image: 'test-image',
  token: 'test-token',
  password: 'test-password',
};

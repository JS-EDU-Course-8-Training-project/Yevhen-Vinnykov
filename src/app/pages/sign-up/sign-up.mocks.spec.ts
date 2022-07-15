import { of, throwError } from 'rxjs';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { INewUser } from 'src/app/shared/models/INewUser';

export const dataMock: INewUser = {
  email: 'test-user@example.com',
  password: 'test-password',
  username: 'test-username',
};

export const userMock: IExistingUser = {
  id: '1',
  email: 'test-user@example.com',
  password: 'test-password',
  image: '',
  username: 'test-username',
};

export const mockError = {
  error: {
    errors: {
      email: ['is wrong'],
    },
  },
};

export class RedirectionServiceMock {
  public redirectHome = () => new Promise<boolean>((resolve) => resolve(true));
}

export class UsersServiceMock {
  public createUser = () => of(userMock);
}

export class UsersServiceMockWithError {
  public createUser = () => throwError(() => mockError);
}

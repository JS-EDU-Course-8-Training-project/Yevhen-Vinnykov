import {
  HttpErrorResponse,
  HttpHeaders,
  HttpEventType,
} from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { IUserData } from 'src/app/shared/models/IUserData';

export const dataMock: IUserData = {
  email: 'test-user@example.com',
  password: 'test-password',
};

export const userMock: IExistingUser = {
  id: '1',
  email: 'test-user@example.com',
  password: 'test-password',
  image: '',
  username: 'test-username',
};

export const mockError: HttpErrorResponse = {
  error: {
    errors: {
      email: ['is wrong'],
    },
  },
  name: 'HttpErrorResponse',
  message: '',
  ok: false,
  headers: new HttpHeaders(),
  status: 0,
  statusText: '',
  url: null,
  type: HttpEventType.ResponseHeader,
};

export class RedirectionServiceMock {
  public redirectHome = () => new Promise<boolean>((resolve) => resolve(true));
}

export class AuthServiceMock {
  public signIn = () => of(userMock);
}

export class AuthServiceMockWithError {
  public signIn = () => throwError(() => 'Email is wrong');
}

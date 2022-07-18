import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IExistingUser } from '../../models/IExistingUser';
import { AuthorizationService } from '../authorization/authorization.service';

import { UsersService } from './users.service';
import { INewUser } from '../../models/INewUser';

const mockUser: IExistingUser = {
  id: '1',
  email: 'test-email',
  username: 'test-username',
  image: 'test-image',
  token: 'test-token',
  password: 'test-password',
};

const mockNewUser: INewUser = {
  email: 'test-email',
  username: 'test-username',
  password: 'test-password',
};

describe('USERS SERVICE', () => {
  let service: UsersService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authorizationServiceSpy: jasmine.SpyObj<AuthorizationService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
    authorizationServiceSpy = jasmine.createSpyObj('AuthorizationService', [
      'authorize',
    ]);
    service = new UsersService(httpClientSpy, authorizationServiceSpy);
  });

  it('createUser should create a user and return correct data', () => {
    httpClientSpy.post.and.returnValue(of({ user: mockUser }));

    service.createUser(mockNewUser).subscribe((newUser) => {
      expect(newUser).toEqual(mockUser);
    });

    expect(authorizationServiceSpy.authorize.calls.count()).toBe(1);
  });

  it('updateUser should return correct data and emit user', () => {
    httpClientSpy.put.and.returnValue(of({ user: mockUser }));

    service.updateUser(mockUser).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    expect(authorizationServiceSpy.authorize.calls.count()).toBe(1);
  });
});

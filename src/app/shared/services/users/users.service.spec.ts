import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IExistingUser } from '../../models/IExistingUser';
import { AuthorizationService } from '../authorization/authorization.service';

import { UsersService } from './users.service';
import { INewUser } from '../../models/INewUser';
import { Router } from '@angular/router';

const mockUser: IExistingUser = {
  email: 'test-email',
  username: 'test-username',
  image: 'test-image',
  token: 'test-token',
  password: 'test-password'
};

const mockNewUser: INewUser = {
  email: 'test-email',
  username: 'test-username',
  password: 'test-password'
};

describe('USERS SERVICE', () => {
  let service: UsersService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authorizationServiceSpy: jasmine.SpyObj<AuthorizationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
    authorizationServiceSpy = jasmine.createSpyObj('AuthorizationService', ['authorize', 'removeAuthorization']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    service = new UsersService(httpClientSpy, authorizationServiceSpy, routerSpy);
  });

  it('createUser should create a user and return correct data', () => {
    httpClientSpy.post.and.returnValue(of({ user: mockUser }));

    service.createUser(mockNewUser).subscribe(newUser => {
      expect(newUser).toEqual(mockUser);
    });

    expect(authorizationServiceSpy.authorize.calls.count()).toBe(1);
  });

  it('signIn should return correct data and emit user', () => {
    httpClientSpy.post.and.returnValue(of({ user: mockUser }));
    const spy = spyOn(service.authUser$, 'next');

    service.signIn({ email: 'test-email', password: 'test-password' }).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(spy).toHaveBeenCalledWith(mockUser);
    });

    expect(authorizationServiceSpy.authorize.calls.count()).toBe(1);
  });

  it('fetchAuthUser should return correct data and emit user', () => {
    httpClientSpy.get.and.returnValue(of({ user: mockUser }));
    const spy = spyOn(service.authUser$, 'next');

    service.fetchAuthUser().subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(spy).toHaveBeenCalledWith(mockUser);
    });
  });

  it('updateUser should return correct data and emit user', () => {
    httpClientSpy.put.and.returnValue(of({ user: mockUser }));
    const spy = spyOn(service.authUser$, 'next');

    service.updateUser(mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(spy).toHaveBeenCalledWith(mockUser);
    });

    expect(authorizationServiceSpy.authorize.calls.count()).toBe(1);
  });

  it('signOut should remove authorization and emit empty user', () => {
    routerSpy.navigateByUrl.and.callThrough();
    const spy = spyOn(service.authUser$, 'next');

    service.signOut();

    expect(spy).toHaveBeenCalledWith({} as IExistingUser);
    expect(authorizationServiceSpy.removeAuthorization.calls.count()).toBe(1);
  });
});

import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProfile } from '../../models/IProfile';

import { ProfilesService } from './profiles.service';

const mockProfile: IProfile = {
  username: 'test-username',
  bio: 'test-bio',
  image: 'test-image',
  following: false
};

describe('ProfilesService Get Method', () => {
  let service: ProfilesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new ProfilesService(httpClientSpy);
  });

  it('fetchUser methods should return expected data', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(of({ profile: mockProfile }));
    service.fetchUser('test-username').subscribe({
      next: user => {
        expect(user).withContext('expected user').toEqual(mockProfile);
        done();
      },
      error: done.fail
    });
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

});

describe('ProfilesService Post Method', () => {
  let service: ProfilesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    service = new ProfilesService(httpClientSpy);
  });

  it('follow methods should return expected data', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(of({ profile: {...mockProfile, following: true} }));
    service.follow('test-username').subscribe({
      next: user => {
        expect(user).withContext('expected user').toEqual({...mockProfile, following: true});
        done();
      },
      error: done.fail
    });
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

});

describe('ProfilesService Delete Method', () => {
  let service: ProfilesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['delete']);
    service = new ProfilesService(httpClientSpy);
  });

  it('unfollow methods should return expected data', (done: DoneFn) => {
    httpClientSpy.delete.and.returnValue(of({ profile: {...mockProfile, following: false} }));
    service.unfollow('test-username').subscribe({
      next: user => {
        expect(user).withContext('expected user').toEqual({...mockProfile, following: false});
        done();
      },
      error: done.fail
    });
    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });

});
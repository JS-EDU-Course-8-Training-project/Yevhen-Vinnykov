import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProfile } from '../../models/IProfile';

import { ProfilesService } from './profiles.service';

const mockProfile: IProfile = {
  username: 'test-username',
  bio: 'test-bio',
  image: 'test-image',
  following: false,
};

describe('PROFILES SERVICE', () => {
  let service: ProfilesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'delete',
    ]);
    service = new ProfilesService(httpClientSpy);
  });

  it('fetchUser() should return expected data', async () => {
    httpClientSpy.get.and.returnValue(of({ profile: mockProfile }));

    const user = await service.fetchUser('test-username');

    expect(user).toEqual(mockProfile);
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });

  it('follow() should return expected data', async () => {
    httpClientSpy.post.and.returnValue(
      of({ profile: { ...mockProfile, following: true } })
    );

    const profile = await service.follow('test-username');

    expect(profile).toEqual({ ...mockProfile, following: true });
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

  it('unfollow methods should return expected data', async () => {
    httpClientSpy.delete.and.returnValue(
      of({ profile: { ...mockProfile, following: false } })
    );
    const profile = await service.unfollow('test-username');

    expect(profile).toEqual({ ...mockProfile, following: false });
    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });
});
import { Router } from '@angular/router';

import { RedirectionService } from './redirection.service';

describe('RedirectionService', () => {
  let service: RedirectionService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    service = new RedirectionService(routerSpy);
  });

  it('methods should return a promise that resolves', () => {
    routerSpy.navigateByUrl.and.returnValue(new Promise<boolean>((resolve, reject) => resolve(true)));
    service.redirectUnauthorized();
    service.redirectToEditArticle('test-slug');
    service.redirectHome();
    service.redirectByUrl('/test-url');
    expect(routerSpy.navigateByUrl.calls.count()).toBe(4);
  });

  it('methods should return a promise that rejects', () => {
    routerSpy.navigateByUrl.and.returnValue(new Promise<boolean>((resolve, reject) => reject('Error')));
    service.redirectUnauthorized();
    service.redirectByUrl('/test-url');
    service.redirectHome();
    service.redirectToEditArticle('test-slug');
    expect(routerSpy.navigateByUrl.calls.count()).toBe(4);
  });

});



import { BehaviorSubject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilesService } from 'src/app/shared/services/profiles/profiles.service';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';

import { FollowButtonComponent } from './follow-button.component';
import { FollowButtonStore } from './follow-button.store';
import { By } from '@angular/platform-browser';
import { TestAttributeDirective } from 'src/app/shared/tests/test-attribute.directive';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

class RedirectionServiceMock {
  public redirectUnauthorized = () =>
    new Promise<boolean>((resolve) => resolve(true));
}

class ProfilesServiceMock {
  public follow = () => new Promise<boolean>((resolve) => resolve(true));
  public unfollow = () => new Promise<boolean>((resolve) => resolve(false));
}

class FollowButtonStoreMock {
  public isLoading$ = new BehaviorSubject<boolean>(false);
  public isFollowed$ = new BehaviorSubject<boolean>(false);
}

describe('FOLLOW BUTTON COMPONENT', () => {
  let component: FollowButtonComponent;
  let fixture: ComponentFixture<FollowButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FollowButtonComponent, TestAttributeDirective],
      providers: [
        { provide: RedirectionService, useClass: RedirectionServiceMock },
        { provide: ProfilesService, useClass: ProfilesServiceMock },
        { provide: FollowButtonStore, useClass: FollowButtonStoreMock },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('follow() should be invoked on click and follow', () => {
    component.isAuth = true;
    component.username = 'test';
    component.isFollowed = false;
    component.ngOnInit();
    fixture.detectChanges();

    const spy = spyOn(component, 'follow').and.callThrough();

    const followButton = fixture.debugElement.query(By.css('button'));
    followButton.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalled();
  });

  it('unfollow() should be invoked on click and unfollow', () => {
    component.isAuth = true;
    component.username = 'test';
    component.isFollowed = true;
    component.ngOnInit();
    fixture.detectChanges();

    const spy = spyOn(component, 'unfollow').and.callThrough();

    const unfollowButton = fixture.debugElement.query(By.css('button'));
    unfollowButton.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalled();
  });

  it('should not follow when unauthorized', () => {
    component.isAuth = false;
    component.username = 'test';
    component.isFollowed = false;
    component.ngOnInit();
    fixture.detectChanges();

    const followButton = fixture.debugElement.query(By.css('button'));
    followButton.triggerEventHandler('click', null);

    expect(component.store.isFollowed$.getValue()).toBe(false);
  });
});

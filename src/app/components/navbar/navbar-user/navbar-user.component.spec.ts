import { UsersService } from './../../../shared/services/users/users.service';
import { BehaviorSubject, of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';

import { NavbarUserComponent } from './navbar-user.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const mockAuthUser: IExistingUser = {
  id: '1',
  email: 'test-email',
  username: 'test-username',
  image: 'test-image',
};

class UsersServiceMock {
  public authUser$ = of(mockAuthUser);
}

describe('NavbarUserComponent', () => {
  let component: NavbarUserComponent;
  let fixture: ComponentFixture<NavbarUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarUserComponent],
      providers: [{ provide: UsersService, useClass: UsersServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarUserComponent);
    component = fixture.componentInstance;
  });

  it('className should be selected', () => {
    component.url$ = new BehaviorSubject<string>('/user/test-username');
    fixture.detectChanges();
    expect(component.className).toBe('selected');
  });

  it('className should be an empty string', () => {
    component.url$ = new BehaviorSubject<string>('some/other-url');
    fixture.detectChanges();
    expect(component.className).toBe('');
  });
});

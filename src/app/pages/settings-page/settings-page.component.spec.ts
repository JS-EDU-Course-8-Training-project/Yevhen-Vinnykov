import { UsersService } from './../../shared/services/users/users.service';
import { of } from 'rxjs';
import { IExistingUser } from './../../shared/models/IExistingUser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPageComponent } from './settings-page.component';
import { SettingsFormComponent } from './settings-form/settings-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const mockUser: IExistingUser = {
  id: '1',
  email: 'test@example.com',
  username: 'test-username',
  bio: 'test-bio',
  image: 'test-image',
  token: 'test-token',
  password: 'test-password',
};

class RedirectionServiceMock {
  public redirectByUrl = () => new Promise<boolean>((resolve) => resolve(true));
  public redirectHome = () => new Promise<boolean>((resolve) => resolve(true));
}

class UsersServiceMock {
  public authUser$ = of(mockUser);
}

describe('SETTINGS PAGE COMPONENT', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPageComponent, SettingsFormComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize correctly', () => {
    expect(component.authUser).toEqual(mockUser);
    expect(component.isDataSaved()).toBe(true);
  });
});

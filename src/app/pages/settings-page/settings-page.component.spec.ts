import { of } from 'rxjs';
import { IExistingUser } from './../../shared/models/IExistingUser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPageComponent } from './settings-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

const mockUser: IExistingUser = {
  id: '1',
  email: 'test@example.com',
  username: 'test-username',
  bio: 'test-bio',
  image: 'test-image',
  token: 'test-token',
  password: 'test-password',
};

class AuthServiceMock {
  public authUser$ = of(mockUser);
}

describe('SETTINGS PAGE COMPONENT', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPageComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthorizationService, useClass: AuthServiceMock },
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

import { UsersService } from './../../../shared/services/users/users.service';
import { BehaviorSubject, of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';

import { SettingsFormComponent } from './settings-form.component';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { By } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

const settingsMock: IExistingUser = {
  id: '1',
  email: 'test-username@example.com',
  username: 'test-username',
  image: 'test-image',
};

class UsersServiceMock {
  public updateUser = () =>
    of({ ...settingsMock, username: 'updated-user-name' });
}

class AuthServiceMock {
  public signOut = () => ({});
}

class RedirectionServiceMock {
  public redirectByUrl = () => new Promise<boolean>((resolve) => resolve(true));
  public redirectHome = () => new Promise<boolean>((resolve) => resolve(true));
}

describe('SETTINGS FORM COMPONENT', () => {
  let component: SettingsFormComponent;
  let fixture: ComponentFixture<SettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsFormComponent],
      imports: [ReactiveFormsModule, FormsModule, MatProgressSpinnerModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
        { provide: AuthorizationService, useClass: AuthServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsFormComponent);
    component = fixture.componentInstance;
    component.authUser = settingsMock;
    component.isModified$ = new BehaviorSubject<boolean>(false);
    fixture.detectChanges();
  });

  it('should initialize correctly', () => {
    expect(component.settingsForm.controls['username'].value).toBe(
      component.authUser.username
    );
  });

  it('should update', () => {
    const spyUpdateSettings = spyOn(
      component,
      'updateSettings'
    ).and.callThrough();

    const updateButton = fixture.debugElement.query(
      By.css('[type="submit"]')
    ).nativeElement;

    updateButton.click();
    fixture.detectChanges();

    expect(spyUpdateSettings).toHaveBeenCalled();
  });

  it('should logout', () => {
    const spy = spyOn(component, 'logout').and.callThrough();

    const logoutButton = fixture.debugElement.query(By.css('[type="button"]'));
    logoutButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('checkIfValid should work correctly', () => {
    const spyCheckIfValid = spyOn(component, 'checkIfValid').and.callThrough();

    component.settingsForm.controls['email'].setValue('wrong-email');
    component.settingsForm.markAllAsTouched();
    fixture.detectChanges();

    expect(spyCheckIfValid).toHaveBeenCalledWith('email');
    expect(component.checkIfValid('email')).toBe(false);
  });
});
import { UsersService } from './../../../shared/services/users/users.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';

import { SettingsFormComponent } from './settings-form.component';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { By } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const settingsMock: IExistingUser = {
  email: 'test-username@example.com',
  username: 'test-username',
  bio: null,
  image: 'test-image'
};

class UsersServiceMockWithError {
  public updateUser = (settings: IExistingUser) => throwError(() => ({error: 'Fetching articles failed'}));
}

class UsersServiceMock {
  public updateUser = (settings: IExistingUser) => of({ ...settingsMock, username: 'updated-user-name' });
  public signOut = () => {};

}

class RedirectionServiceMock {
  public redirectByUrl = () => new Promise<boolean>((resolve, reject) => resolve(true));
  public redirectHome = () => new Promise<boolean>((resolve, reject) => resolve(true));
}

describe('SettingsFormComponent', () => {
  let component: SettingsFormComponent;
  let fixture: ComponentFixture<SettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsFormComponent],
      imports: [ReactiveFormsModule, FormsModule, MatProgressSpinnerModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsFormComponent);
    component = fixture.componentInstance;
    component.authUser = settingsMock;
    component.isModified$ = new BehaviorSubject<boolean>(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', () => {
    expect(component.settingsForm.controls['username'].value).toBe(component.authUser.username);
  });

  it('should update correctly', () => {
    const spyUpdateSettings = spyOn(component, 'updateSettings').and.callThrough();
    const spyCreateUserData = spyOn<any>(component, 'createUserData');
    const spyOnSubmit = spyOn<any>(component, 'onSubmit');
    const updateButton = fixture.debugElement.query(By.css('[data-angular="test-update-button"]')).nativeElement;
    updateButton.click();
    fixture.detectChanges();
    expect(spyUpdateSettings).toHaveBeenCalled();
    expect(spyCreateUserData).toHaveBeenCalled();
    expect(spyOnSubmit).toHaveBeenCalled();
  });

  it('should logout', () => {
    const logoutButton = fixture.debugElement.query(By.css('[data-angular="test-logout-button"]'));
    const spy = spyOn(component, 'logout').and.callThrough();
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



describe('OnCatchError', () => {
  let component: SettingsFormComponent;
  let fixture: ComponentFixture<SettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsFormComponent],
      imports: [ReactiveFormsModule, FormsModule, MatProgressSpinnerModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceMockWithError },
        { provide: RedirectionService, useClass: RedirectionServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsFormComponent);
    component = fixture.componentInstance;
    component.authUser = settingsMock;
    fixture.detectChanges();
  });

  it('should be invoked', () => {
    const spy = spyOn<any>(component, 'onCatchError').and.callThrough();
    const updateButton = fixture.debugElement.query(By.css('[data-angular="test-update-button"]')).nativeElement;
    updateButton.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith({error: 'Fetching articles failed'});
    expect(component.error).toBe('Fetching articles failed');
  });

});
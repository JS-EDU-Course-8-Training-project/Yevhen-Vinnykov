import { By } from '@angular/platform-browser';
import { RedirectionService } from './../../shared/services/redirection/redirection.service';
import { UsersService } from './../../shared/services/users/users.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignUpComponent } from './sign-up.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  UsersServiceMock,
  RedirectionServiceMock,
  dataMock,
  UsersServiceMockWithError,
  mockError,
} from './sign-up.mocks.spec';

describe('SIGN UP COMPONENT', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form should be invalid and button disabled on first render', () => {
    const signinButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;

    expect(component.signupForm.valid).toBe(false);
    expect(signinButton.disabled).toBe(true);
  });

  it('form should be valid and button enabled on data input', () => {
    const signinButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;

    component.signupForm.setValue(dataMock);
    fixture.detectChanges();

    expect(component.signupForm.valid).toBe(true);
    expect(signinButton.disabled).toBe(false);
  });

  it('should sign up', () => {
    const signinButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    const spyHandleSignin = spyOn(component, 'handleSignup').and.callThrough();
    const spyOnSubmit = spyOn<any>(component, 'onSubmit').and.callThrough();
    const spyCreateUserData = spyOn<any>(
      component,
      'createUserData'
    ).and.callThrough();

    component.signupForm.setValue(dataMock);
    fixture.detectChanges();

    signinButton.click();

    expect(spyHandleSignin).toHaveBeenCalled();
    expect(spyOnSubmit).toHaveBeenCalled();
    expect(spyCreateUserData).toHaveBeenCalled();
  });

  it('checkIfValid should work correctly', () => {
    const spyCheckIfValid = spyOn(component, 'checkIfValid').and.callThrough();

    component.signupForm.controls['email'].setValue('invalid-email');
    component.signupForm.markAllAsTouched();
    fixture.detectChanges();

    expect(spyCheckIfValid).toHaveBeenCalledWith('email');
    expect(component.checkIfValid('email')).toBe(false);
  });
});

describe('ON CATCH ERROR METHOD', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceMockWithError },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be invoked', () => {
    const signinButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    const spy = spyOn<any>(component, 'onCatchError').and.callThrough();

    component.signupForm.setValue(dataMock);
    fixture.detectChanges();

    signinButton.click();

    expect(spy).toHaveBeenCalledWith(mockError);
    expect(component.errors).toEqual(['email is wrong']);
  });
});

import { UsersService } from './../../shared/services/users/users.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignInComponent } from './sign-in.component';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  dataMock,
  mockError,
  RedirectionServiceMock,
  UsersServiceMock,
  UsersServiceMockWithError
} from './sign-in.mocks.spec';


describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid and button disabled on first render', () => {
    const signinButton = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(component.signinForm.valid).toBe(false);
    expect(signinButton.disabled).toBe(true);
  });

  it('form should be valid and button enabled on data input', () => {
    const signinButton = fixture.debugElement.query(By.css('button')).nativeElement;
    component.signinForm.setValue(dataMock);
    fixture.detectChanges();
    expect(component.signinForm.valid).toBe(true);
    expect(signinButton.disabled).toBe(false);
  });

  it('should sign in', () => {
    const signinButton = fixture.debugElement.query(By.css('button')).nativeElement;
    const spyHandleSignin = spyOn(component, 'handleSignin').and.callThrough();
    const spyOnSubmit = spyOn<any>(component, 'onSubmit').and.callThrough();
    const spyCreateUserData = spyOn<any>(component, 'createUserData').and.callThrough();
    component.signinForm.setValue(dataMock);
    fixture.detectChanges();
    signinButton.click();
    expect(spyHandleSignin).toHaveBeenCalled();
    expect(spyOnSubmit).toHaveBeenCalled();
    expect(spyCreateUserData).toHaveBeenCalled();
  });

  it('checkIfValid should work correctly', () => {
    const spyCheckIfValid = spyOn(component, 'checkIfValid').and.callThrough();
    component.signinForm.controls['email'].setValue('wrong-email');
    component.signinForm.markAllAsTouched();
    fixture.detectChanges();
    expect(spyCheckIfValid).toHaveBeenCalledWith('email');
    expect(component.checkIfValid('email')).toBe(false);
  });

});


describe('OnCatchError', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceMockWithError },
        { provide: RedirectionService, useClass: RedirectionServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be invoked', () => {
    const signinButton = fixture.debugElement.query(By.css('button')).nativeElement;
    const spy = spyOn<any>(component, 'onCatchError').and.callThrough();
    component.signinForm.setValue(dataMock);
    fixture.detectChanges();
    signinButton.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(mockError);
    expect(component.errors).toEqual(['email is wrong']);
  });

});

import { UsersService } from './../../shared/services/users/users.service';
import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { IUserData } from 'src/app/shared/models/IUserData';

import { SignInComponent } from './sign-in.component';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const dataMock: IUserData = {
  email: 'test-user@example.com',
  password: 'test-password'
};

const userMock: IExistingUser = {
  email: 'test-user@example.com',
  password: 'test-password',
  bio: null,
  image: '',
  username: 'test-username'
};

const mockError: HttpErrorResponse = {
  error: {
    errors: {
      'email': ['is wrong']
    }
  },
  name: 'HttpErrorResponse',
  message: '',
  ok: false,
  headers: new HttpHeaders,
  status: 0,
  statusText: '',
  url: null,
  type: HttpEventType.ResponseHeader
};

class RedirectionServiceMock {
  public redirectHome = () => new Promise<boolean>((resolve, reject) => resolve(true));
}

class UsersServiceMock {
  public signIn = (data: IUserData) => of(userMock);
}

class UsersServiceMockWithError {
  public signIn = (data: IUserData) => throwError(() => mockError);
}

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


// describe('OnCatchError', () => {
//   let component: SignInComponent;
//   let fixture: ComponentFixture<SignInComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [SignInComponent],
//       imports: [ReactiveFormsModule, FormsModule],
//       providers: [
//         { provide: UsersService, useClass: UsersServiceMockWithError },
//         { provide: RedirectionService, useClass: RedirectionServiceMock }
//       ]
//     })
//       .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SignInComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should be invoked', () => {
//     const signinButton = fixture.debugElement.query(By.css('button')).nativeElement;
//     const spy = spyOn<any>(component, 'onCatchError').and.callThrough();
//     component.signinForm.setValue(dataMock);
//     fixture.detectChanges();
//     signinButton.click();
//     fixture.detectChanges();
//     expect(spy).toHaveBeenCalledWith(mockError);
//     expect(component.errors).toEqual(['email is wrong']);
//   });

// });

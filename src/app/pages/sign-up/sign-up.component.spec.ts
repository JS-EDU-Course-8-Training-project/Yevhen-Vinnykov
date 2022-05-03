import { By } from '@angular/platform-browser';
import { RedirectionService } from './../../shared/services/redirection/redirection.service';
import { UsersService } from './../../shared/services/users/users.service';
import { IUserData } from './../../shared/models/IUserData';
import { of, throwError } from 'rxjs';
import { IExistingUser } from './../../shared/models/IExistingUser';
import { INewUser } from './../../shared/models/INewUser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignUpComponent } from './sign-up.component';

const dataMock: INewUser = {
  email: 'test-user@example.com',
  password: 'test-password',
  username: 'test-username'
};

const userMock: IExistingUser = {
  email: 'test-user@example.com',
  password: 'test-password',
  bio: null,
  image: '',
  username: 'test-username'
};

const mockError = {
  error: {
    errors: {
      'email': 'is wrong'
    }
  }
};

class RedirectionServiceMock {
  public redirectHome = () => new Promise<boolean>((resolve, reject) => resolve(true));
}

class UsersServiceMock {
  public createUser = (data: INewUser) => of(userMock);
}

class UsersServiceMockWithError {
  public createUser = (data: IUserData) => throwError(() => mockError);
}

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid and button disabled on first render', () => {
    const signinButton = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(component.signupForm.valid).toBe(false);
    expect(signinButton.disabled).toBe(true);
  });

  it('form should be valid and button enabled on data input', () => {
    const signinButton = fixture.debugElement.query(By.css('button')).nativeElement;
    component.signupForm.setValue(dataMock);
    fixture.detectChanges();
    expect(component.signupForm.valid).toBe(true);
    expect(signinButton.disabled).toBe(false);
  });

  it('should sign up', () => {
    const signinButton = fixture.debugElement.query(By.css('button')).nativeElement;
    const spyHandleSignin = spyOn(component, 'handleSignup').and.callThrough();
    const spyOnSubmit = spyOn<any>(component, 'onSubmit').and.callThrough();
    const spyCreateUserData = spyOn<any>(component, 'createUserData').and.callThrough();
    component.signupForm.setValue(dataMock);
    fixture.detectChanges();
    signinButton.click();
    expect(spyHandleSignin).toHaveBeenCalled();
    expect(spyOnSubmit).toHaveBeenCalled();
    expect(spyCreateUserData).toHaveBeenCalled();
  });

});


describe('OnCatchError', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceMockWithError },
        { provide: RedirectionService, useClass: RedirectionServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be invoked', () => {
    const signinButton = fixture.debugElement.query(By.css('button')).nativeElement;
    const spy = spyOn<any>(component, 'onCatchError');
    component.signupForm.setValue(dataMock);
    fixture.detectChanges();
    signinButton.click();
    expect(spy).toHaveBeenCalled();
  });

});

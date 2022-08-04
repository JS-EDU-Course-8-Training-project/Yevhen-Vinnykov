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

  it('should call handleSignUp and sign up', () => {
    const signinButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    const spyHandleSignUp = spyOn(component, 'handleSignUp').and.callThrough();

    component.signUpForm.setValue(dataMock);
    fixture.detectChanges();
    signinButton.click();

    expect(spyHandleSignUp).toHaveBeenCalled();
  });

  it('should call handleSignUp but not sign up because the form is empty', () => {
    const signinButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    const spyHandleSignUp = spyOn(component, 'handleSignUp').and.callThrough();

    signinButton.click();

    expect(spyHandleSignUp).toHaveBeenCalled();
  });
});

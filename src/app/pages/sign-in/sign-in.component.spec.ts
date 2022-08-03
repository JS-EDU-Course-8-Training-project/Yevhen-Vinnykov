import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignInComponent } from './sign-in.component';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  dataMock,
  RedirectionServiceMock,
  AuthServiceMock,
} from './sign-in.mocks.spec';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

describe('SIGN IN COMPONENT', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthorizationService, useClass: AuthServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should sign in', () => {
    const signinButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    const spyHandleSignin = spyOn(component, 'handleSignin').and.callThrough();

    component.signInForm.setValue(dataMock);
    fixture.detectChanges();

    signinButton.click();

    expect(spyHandleSignin).toHaveBeenCalled();
  });
});

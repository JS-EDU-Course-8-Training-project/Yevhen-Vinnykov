import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { INewUser } from 'src/app/shared/models/INewUser';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

type TSignupControls = 'username' | 'email' | 'password';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent extends TestedComponent implements OnInit {
  public signUpForm!: FormGroup;
  public error!: string;
  public isLoading = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private redirectionService: RedirectionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.{6,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/),
        ],
      ],
    });
  }

  public checkIfValid(formControl: TSignupControls): boolean {
    return !(
      this.signUpForm.controls[formControl].touched &&
      this.signUpForm.controls[formControl].invalid
    );
  }

  public async handleSignUp(): Promise<void> {
    this.signUpForm.disable();
    this.isLoading = true;
    this.error = '';

    try {
      const signUpData: INewUser = this.signUpForm.getRawValue();
      await this.usersService.createUser(signUpData);
      this.isLoading = false;
      this.redirectionService.redirectHome();
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private onCatchError(error: string): void {
    this.error = error;
    this.isLoading = false;
    this.signUpForm.enable();
    this.signUpForm.markAsUntouched();
  }
}

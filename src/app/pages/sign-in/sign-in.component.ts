import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { IUserData } from '../../shared/models/IUserData';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent extends TestedComponent implements OnInit {
  public signInForm!: FormGroup;
  public error!: string;
  public isLoading = false;

  constructor(
    private fb: FormBuilder,
    private redirectionService: RedirectionService,
    private authService: AuthorizationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      },
      { updateOn: 'blur' }
    );
  }

  public async handleSignin(): Promise<void> {
    if(this.signInForm.invalid) return;

    this.signInForm.disable();
    this.error = '';
    this.isLoading = true;

    try {
      const signInData: IUserData = this.signInForm.getRawValue();
      await this.authService.signIn(signInData);
      this.isLoading = false;
      this.redirectionService.redirectHome();
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private onCatchError(error: string): void {
    this.error = error;
    this.isLoading = false;
    this.signInForm.enable();
    this.signInForm.markAsUntouched();
  }
}

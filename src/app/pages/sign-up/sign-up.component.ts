import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { catchError, Subject, takeUntil, of, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { INewUser } from 'src/app/shared/models/INewUser';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

type TSignupControls = 'username' | 'email' | 'password';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent extends TestedComponent implements OnInit {
  public signupForm!: FormGroup;
  public error!: string;
  public isPending = false;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private redirectionService: RedirectionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public checkIfValid(formControl: TSignupControls): boolean {
    return !(
      this.signupForm.controls[formControl].touched &&
      this.signupForm.controls[formControl].invalid
    );
  }

  private createUserData(): INewUser {
    return this.signupForm.getRawValue();
  }

  private onSubmit(): void {
    this.signupForm.disable();
    this.isPending = true;
    this.error = '';
  }

  private onCatchError(error: string): Observable<IExistingUser> {
    this.error = error;
    this.isPending = false;
    this.signupForm.enable();
    this.signupForm.markAsUntouched();

    return of({} as IExistingUser);
  }

  public handleSignup(): void {
    this.onSubmit();

    this.usersService
      .createUser(this.createUserData())
      .pipe(
        takeUntil(this.notifier),
        catchError((error: string) => this.onCatchError(error))
      )
      .subscribe(() => {
        this.isPending = false;
        if (!this.error) this.redirectionService.redirectHome();
      });
  }
}

import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { catchError, Subject, takeUntil, of, Observable } from 'rxjs';
import { IUserData } from '../../shared/models/IUserData';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { HttpErrorResponse } from '@angular/common/http';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

type TSigninControls = 'email' | 'password';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends TestedComponent implements OnInit, OnDestroy {
  public signinForm!: FormGroup;
  public errors: string[] = [];
  public isPending: boolean = false;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private redirectionService: RedirectionService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public checkIfValid(formControl: TSigninControls): boolean {
    return !(this.signinForm.controls[formControl].touched && this.signinForm.controls[formControl].invalid);
  }

  private createUserData(): IUserData {
    return this.signinForm.getRawValue();
  }

  private onSubmit(): void {
    this.signinForm.disable();
    this.errors = [];
    this.isPending = true;
  }

  private onCatchError(error: HttpErrorResponse): Observable<IExistingUser> {
    Object.keys(error.error.errors).forEach(key => {
      this.errors.push(`${key} ${error.error.errors[key][0]}`)
    });

    this.isPending = false;
    this.signinForm.enable();
    this.signinForm.markAsUntouched();

    return of({} as IExistingUser);
  }

  public handleSignin(): void {
    this.onSubmit();

    this.usersService.signIn(this.createUserData())
      .pipe(
        takeUntil(this.notifier),
        catchError((error: HttpErrorResponse): any => this.onCatchError(error)))
      .subscribe((user: IExistingUser | any) => {
        this.isPending = false;
        if (!this.errors.length) this.redirectionService.redirectHome();;
      });
  }
}



import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { catchError, Subject, takeUntil, of, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { INewUser } from 'src/app/shared/models/INewUser';
import { HttpErrorResponse } from '@angular/common/http';

type TSignupControls = 'username' | 'email' | 'password';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signupForm!: FormGroup;
  public errors: string[] = [];
  public isPending: boolean = false;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private redirectionService: RedirectionService,
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  public checkIfValid(formControl: TSignupControls): boolean {
    return !(this.signupForm.controls[formControl].touched && this.signupForm.controls[formControl].invalid);
  }

  private createUserData(): INewUser {
    return this.signupForm.getRawValue();
  }

  private onSubmit(): void {
    this.signupForm.disable();
    this.isPending = true;
    this.errors = [];
  }

  private onCatchError(error: HttpErrorResponse): Observable<IExistingUser> {
    Object.keys(error.error.errors).forEach(key => {
      this.errors.push(`${key} ${error.error.errors[key][0]}`)
    })

    this.isPending = false;
    this.signupForm.enable();
    this.signupForm.markAsUntouched();

    return of({} as IExistingUser);
  }

  public handleSignup(): void {
    this.onSubmit();
    
    this.usersService.createUser(this.createUserData())
      .pipe(
        takeUntil(this.notifier),
        catchError((error: HttpErrorResponse): any => this.onCatchError(error)))
      .subscribe((user: IExistingUser | any) => {
        this.isPending = false;
        if (!this.errors.length) this.redirectionService.redirectHome();
      });
  }
}

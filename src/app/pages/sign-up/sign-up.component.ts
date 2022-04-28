import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { catchError, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { INewUser } from 'src/app/shared/models/INewUser';
import { HttpErrorResponse } from '@angular/common/http';

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

  public checkIfValid(formControl: string): boolean {
    return !(this.signupForm.get(formControl)?.touched && this.signupForm.get(formControl)?.invalid);
  }

  private createUserData(): INewUser {
    return {
      username: this.signupForm.getRawValue().username,
      email: this.signupForm.getRawValue().email,
      password: this.signupForm.getRawValue().password
    };
  }

  private onSubmit(): void {
    this.signupForm.disable();
    this.isPending = true;
    this.errors = [];
  }

  private onCatchError(error: HttpErrorResponse): void {
    Object.keys(error.error.errors).forEach(key => {
      this.errors.push(`${key} ${error.error.errors[key][0]}`)
    })
    this.isPending = false;
    this.signupForm.enable();
    this.signupForm.markAsUntouched();
  }

  public handleSignup(): void {
    this.onSubmit();
    this.usersService.createUser(this.createUserData())
      .pipe(
        takeUntil(this.notifier),
        catchError((error: HttpErrorResponse): any => this.onCatchError(error)))
      .subscribe((user: IExistingUser | any) => {
        this.redirectionService.redirectHome();
        this.isPending = false;
      });
  }
}

import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { catchError, Subject, takeUntil } from 'rxjs';
import { IUserData } from '../../shared/models/IUserData';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  public signinForm!: FormGroup;
  public errors: string[] = [];
  public isPending: boolean = false;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private redirectionService: RedirectionService,
  ) { }

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

  public checkIfValid(formControl: string): boolean {
    return !(this.signinForm.get(formControl)?.touched && this.signinForm.get(formControl)?.invalid);
  }

  private createUserData(): IUserData {
    return {
      email: this.signinForm.getRawValue().email,
      password: this.signinForm.getRawValue().password,
    };
  }

  private onSubmit(): void {
    this.signinForm.disable();
    this.errors = [];
    this.isPending = true;
  }

  private onCatchError(error: HttpErrorResponse): void {
    Object.keys(error.error.errors).forEach(key => {
      this.errors.push(`${key} ${error.error.errors[key][0]}`)
    });
    this.isPending = false;
    this.signinForm.enable();
    this.signinForm.markAsUntouched();
  }

  public handleSignin(): void {
    this.onSubmit();
    this.usersService.signIn(this.createUserData())
      .pipe(
        takeUntil(this.notifier),
        catchError((error: HttpErrorResponse): any => this.onCatchError(error)))
      .subscribe((user: IExistingUser | any) => {
        this.redirectionService.redirectHome();
        this.isPending = false;
      });
  }
}



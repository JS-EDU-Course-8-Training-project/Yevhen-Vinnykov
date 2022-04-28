import { Subject, takeUntil } from 'rxjs';
import { IUserData } from '../../shared/models/IUserData';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';

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
    private router: Router,
    private authorizationService: AuthorizationService
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

  public handleSignin(): void {
    this.signinForm.disable();
    this.errors = [];
    this.isPending = true;
    const user: IUserData = {
      email: this.signinForm.getRawValue().email,
      password: this.signinForm.getRawValue().password
    };
    this.usersService.signIn(user)
      .pipe(takeUntil(this.notifier))
      .subscribe((res: IExistingUser | any) => {
        if (res.error) {
          Object.keys(res.error.errors).forEach(key => {
            this.errors.push(`${key} ${res.error.errors[key][0]}`)
          })
          this.isPending = false;
          this.signinForm.enable();
          this.signinForm.markAsUntouched();
          return;
        }
        this.authorizationService.authorize(res.token);
        this.router.navigateByUrl('').catch(err => console.log(err));
        this.isPending = false;
      });
  }
}



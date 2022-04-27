import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/services/users.service';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/services/authorization.service';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';

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
    private router: Router,
    private authorizationService: AuthorizationService
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

  public handleSignup(): void {
    this.signupForm.disable();
    this.isPending = true;
    this.errors = [];
    const newUser = {
      username: this.signupForm.getRawValue().username,
      email: this.signupForm.getRawValue().email,
      password: this.signupForm.getRawValue().password
    };
    this.usersService.createUser(newUser)
    .pipe(takeUntil(this.notifier))
    .subscribe((res: IExistingUser | any) => {
      if (res.error) {
        Object.keys(res.error.errors).forEach(key => {
          this.errors.push(`${key} ${res.error.errors[key][0]}`)
        })
        this.isPending = false;
        this.signupForm.enable();
        this.signupForm.markAsUntouched();
        return;
      }
      this.authorizationService.authorize(res.token);
      this.router.navigateByUrl('').catch(err => console.log(err));
      this.isPending = false;
    });
  }
}

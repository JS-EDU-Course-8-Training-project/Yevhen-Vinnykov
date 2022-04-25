import { IUserData } from './../../models/IUserData';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signinForm!: FormGroup;
  errors: string[] = [];
  isPending: boolean = false;
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

  checkIfValid(formControl: string): boolean {
    return !(this.signinForm.get(formControl)?.touched && this.signinForm.get(formControl)?.invalid);
  }

  handleSignin(): void {
    this.signinForm.disable();
    this.errors = [];
    this.isPending = true;
    const user: IUserData = {
      email: this.signinForm.getRawValue().email,
      password: this.signinForm.getRawValue().password
    };

    this.usersService.signIn(user).subscribe((res: any) => {
      if (res.error) {
        Object.keys(res.error.errors).forEach(key => {
          this.errors.push(`${key} ${res.error.errors[key][0]}`)
        })
        this.isPending = false;
        this.signinForm.enable();
        this.signinForm.markAsUntouched();
        return;
      }
      this.authorizationService.authorize(res.user.token);
      this.router.navigateByUrl('').catch(err => console.log(err));
      this.isPending = false;
    });
  }
}



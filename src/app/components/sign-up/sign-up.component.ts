import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signupForm: any;
  errors: string[] = [];
  isPending: boolean = false;
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

  checkIfValid(formControl: string): boolean {
    return !(this.signupForm.get(formControl).touched && this.signupForm.get(formControl).invalid);
  }

  handleSignup(): void {
    this.signupForm.disable();
    this.isPending = true;
    this.errors = [];
    const newUser = {
      username: this.signupForm.getRawValue().username,
      email: this.signupForm.getRawValue().email,
      password: this.signupForm.getRawValue().password
    };

    this.usersService.createUser(newUser).subscribe((res: any) => {
      if (res.error) {
        Object.keys(res.error.errors).forEach(key => {
          this.errors.push(`${key} ${res.error.errors[key][0]}`)
        })
        this.isPending = false;
        this.signupForm.enable();
        this.signupForm.markAsUntouched();
        return;
      }
      this.authorizationService.authorize(res.user.token);
      this.router.navigateByUrl('').catch(err => console.log(err));
      this.isPending = false;
    });
  }
}

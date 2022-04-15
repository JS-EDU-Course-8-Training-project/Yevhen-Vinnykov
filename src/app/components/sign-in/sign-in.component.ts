import { IUserData } from './../../models/IUserData';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signinForm: any;
  errors: string[] = [];
  isPending: boolean = false;
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  checkIfValid(formControl: string): boolean {
    return !(this.signinForm.get(formControl).touched && this.signinForm.get(formControl).invalid);
  }

  handleSignin(): void {
    this.isPending = true;
    const user: IUserData = {
      email: this.signinForm.getRawValue().email,
      password: this.signinForm.getRawValue().password
    };

    this.usersService.signIn(user).subscribe((res: any) => {
      if (res.errors) {
        Object.keys(res.errors).forEach(key => {
          this.errors.push(`${key} ${res.errors[key][0]}`)
        })
        console.log(Object.keys(res.errors));
        console.log(this.errors);
        this.isPending = false;
        return;
      }      
      localStorage.setItem('token', res.user.token);
      localStorage.setItem('authorized', 'true');
      this.router.navigateByUrl('').catch(err => console.log(err));
      this.isPending = false;
    });
  }
}



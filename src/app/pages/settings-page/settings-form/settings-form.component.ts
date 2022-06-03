import { IUpdateUser } from './../../../shared/models/IUpdateUser';
import { Subject, takeUntil, BehaviorSubject, catchError, of, Observable } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { Component, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { HttpErrorResponse } from '@angular/common/http';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';

type TSettingsControls = 'image' | 'username' | 'bio' | 'email' | 'password';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})

export class SettingsFormComponent implements OnChanges, OnDestroy, OnInit {
  @Input() authUser!: IExistingUser;
  @Input() isModified$!: BehaviorSubject<boolean>;

  public errors: string[] = [];
  public isPending!: boolean;
  public settingsForm!: FormGroup;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private redirectionService: RedirectionService,
  ) { }

  ngOnChanges(): void {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.settingsForm.valueChanges
      .pipe(takeUntil(this.notifier))
      .subscribe(() => this.isModified$.next(true));

  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private initializeForm(): void {
    this.settingsForm = this.fb.group({
      image: [this.authUser.image],
      username: [this.authUser.username, [Validators.required]],
      bio: [this.authUser.bio],
      email: [this.authUser.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public checkIfValid(formControl: TSettingsControls): boolean {
    return !(this.settingsForm.controls[formControl].touched && this.settingsForm.controls[formControl].invalid);
  }

  private createUserData(): IUpdateUser {
    const formData: IExistingUser = this.settingsForm.getRawValue();
    const updatedData: IUpdateUser = {};
    for (const key in formData) {
      const formDataProp = formData[key as keyof IExistingUser];
      const authUserProp = this.authUser[key as keyof IExistingUser];
      if(key === 'password' && formDataProp){
        updatedData[key as keyof IUpdateUser] = formData[key as keyof IUpdateUser];
        continue;
      }
      if (key !== 'password' && formDataProp !== authUserProp) {
        updatedData[key as keyof IUpdateUser] = formData[key as keyof IUpdateUser];
      }
    }
    return updatedData;
  }

  private onSubmit(): void {
    this.isPending = true;
    this.settingsForm.disable();
    this.errors = [];
  }

  private onCatchError(error: HttpErrorResponse): Observable<IExistingUser> {
    Object.keys(error.error.errors).forEach(key => {
      this.errors.push(`${key} ${error.error.errors[key][0]}`)
    });
    this.isPending = false;
    this.settingsForm.enable();
    this.settingsForm.markAsUntouched();
    return of({} as IExistingUser);
  }

  public updateSettings(): void {
    this.onSubmit();
    this.usersService.updateUser(this.createUserData())
      .pipe(
        takeUntil(this.notifier),
        catchError((error: HttpErrorResponse): any => this.onCatchError(error)))
      .subscribe((user: IExistingUser | any) => {
        this.isModified$.next(false);
        if (!this.errors.length) {
          this.redirectionService.redirectByUrl(`user/${user.username}`);
        }
      });
  }

  public logout(): void {
    this.usersService.signOut();
    this.redirectionService.redirectHome();
  }
}

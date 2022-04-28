import { Subject, take, takeUntil, BehaviorSubject, catchError } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})

export class SettingsFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() authUser!: IExistingUser;
  @Input() isModified$!: BehaviorSubject<boolean>;

  public error: string = '';
  public isPending!: boolean;
  public settingsForm!: FormGroup;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.settingsForm.valueChanges
      .pipe(take(1))
      .subscribe(() => this.isModified$.next(true));
  }

  ngOnChanges(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  private initializeForm(): void {
    this.settingsForm = this.fb.group({
      imageURL: [this.authUser?.image || ''],
      username: [this.authUser?.username || '', [Validators.required]],
      bio: [this.authUser?.bio || ''],
      email: [this.authUser?.email || '', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public checkIfValid(formControl: string): boolean {
    return !(this.settingsForm.get(formControl)?.touched && this.settingsForm.get(formControl)?.invalid);
  }

  private createUserData(): IExistingUser {
    return {
      image: this.settingsForm.getRawValue().imageURL,
      username: this.settingsForm.getRawValue().username,
      bio: this.settingsForm.getRawValue().bio,
      email: this.settingsForm.getRawValue().email,
      password: this.settingsForm.getRawValue().newPassword,
    };
  }

  private onSubmit(): void {
    this.isPending = true;
    this.settingsForm.disable();
    this.error = '';
  }

  private onCatchError(error: HttpErrorResponse): void {
    this.error = error.error;
    this.isPending = false;
    this.settingsForm.enable();
    this.settingsForm.markAsUntouched();
  }

  public updateSettings(): void {
    this.onSubmit();
    this.usersService.updateUser(this.createUserData())
      .pipe(
        takeUntil(this.notifier),
        catchError((error: HttpErrorResponse): any => this.onCatchError(error)))
      .subscribe((user: IExistingUser | any) => {
        this.isModified$.next(false);
        this.authorizationService.authorize(user.token || '');
        this.router.navigateByUrl(`user/${user.username}`);
      });
  }

  public logout(): void {
    this.authorizationService.removeAuthorization();
    this.router.navigateByUrl('/');
  }
}

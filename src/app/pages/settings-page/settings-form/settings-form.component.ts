import { IUpdateUser } from './../../../shared/models/IUpdateUser';
import { Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IExistingUser } from 'src/app/shared/models/IExistingUser';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

type TSettingsControls = 'image' | 'username' | 'bio' | 'email' | 'password';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss'],
})
export class SettingsFormComponent
  extends TestedComponent
  implements OnDestroy, OnInit
{
  @Input() authUser!: IExistingUser;
  @Input() isModified$!: BehaviorSubject<boolean>;

  public error!: string;
  public isLoading!: boolean;
  public settingsForm!: FormGroup;
  private notifier: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private redirectionService: RedirectionService,
    private authService: AuthorizationService
  ) {
    super();
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
    return !(
      this.settingsForm.controls[formControl].touched &&
      this.settingsForm.controls[formControl].invalid
    );
  }

  private createUserData(): IUpdateUser {
    const formData: IExistingUser = this.settingsForm.getRawValue();
    const updatedData: IUpdateUser = {};

    for (const key in formData) {
      const formDataProp = formData[key as keyof IExistingUser];
      const authUserProp = this.authUser[key as keyof IExistingUser];

      if (formDataProp && formDataProp !== authUserProp) {
        updatedData[key as keyof IUpdateUser] =
          formData[key as keyof IUpdateUser];
      }
    }
    return updatedData;
  }

  public async updateSettings(): Promise<void> {
    this.isLoading = true;
    this.settingsForm.disable();
    this.error = '';

    try {
      const { username } = await this.usersService.updateUser(
        this.createUserData()
      );
      this.isModified$.next(false);
      this.redirectionService.redirectByUrl(`user/${username}`);
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private onCatchError(error: string): void {
    this.error = error;
    this.isLoading = false;
    this.settingsForm.enable();
    this.settingsForm.markAsUntouched();
  }

  public logout(): void {
    this.authService.signOut();
    this.redirectionService.redirectHome();
  }
}

import { Subject, take, takeUntil } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IExistingUser } from 'src/app/models/IExistingUser';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})

export class SettingsFormComponent implements OnChanges, OnDestroy {
  @Input() authUser!: IExistingUser;
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

  public updateSettings(): void {
    this.isPending = true;
    this.settingsForm.disable();
    this.error = '';
    const settings: IExistingUser = {
      image: this.settingsForm.getRawValue().imageURL,
      username: this.settingsForm.getRawValue().username,
      bio: this.settingsForm.getRawValue().bio,
      email: this.settingsForm.getRawValue().email,
      password: this.settingsForm.getRawValue().newPassword,
    };
    this.usersService.updateUser(settings).pipe(takeUntil(this.notifier))
      .subscribe(res => {
        if (res.error) {
          this.error = res.error;
          this.isPending = false;
          this.settingsForm.enable();
          this.settingsForm.markAsUntouched();
          return;
        }
        this.router.navigateByUrl(`user/${res.username}`);
      });
  }

  public logout(): void {
    this.authorizationService.removeAuthorization();
    this.router.navigateByUrl('/');
  }
}

import { UsersService } from 'src/app/services/users.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IExistingUser } from 'src/app/models/IExistingUser';
import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization.service';


@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit, OnChanges {
  public settingsForm: any;
  @Input() authUser!: IExistingUser;
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      imageURL: [this.authUser?.image],
      username: [this.authUser?.username],
      bio: [this.authUser?.bio],
      email: [this.authUser?.email],
      newPassword: [''],
    });

  }
  ngOnChanges(): void {
    this.ngOnInit();
  }

  updateSettings(): void {
    const settings: IExistingUser = {
      image: this.settingsForm.getRawValue().imageURL,
      username: this.settingsForm.getRawValue().username,
      bio: this.settingsForm.getRawValue().bio,
      email: this.settingsForm.getRawValue().email,
      password: this.settingsForm.getRawValue().newPassword,
    };
    this.usersService.updateUser(settings).subscribe(user => {
      this.router.navigateByUrl(`user/${user.username}`); // TODO: change redirect to User Page
    });
  }

  logout(): void {
    this.authorizationService.removeAuthorization();
    this.router.navigateByUrl('/');
  }
}

import { UsersService } from './../../shared/services/users/users.service';
import { of } from 'rxjs';
import { IExistingUser } from './../../shared/models/IExistingUser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPageComponent } from './settings-page.component';
import { SettingsFormComponent } from './settings-form/settings-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';


const mockUser: IExistingUser = {
  email: 'test@example.com',
  username: 'test-username',
  bio: 'test-bio',
  image: 'test-image',
  token: 'test-token',
  password: 'test-password'
}

class RedirectionServiceMock {
  public redirectByUrl = () => new Promise<boolean>((resolve, reject) => resolve(true));
  public redirectHome = () => new Promise<boolean>((resolve, reject) => resolve(true));
}

class UsersServiceMock {
  public authUser$ = of(mockUser);
}

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPageComponent, SettingsFormComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceMock },
        { provide: RedirectionService, useClass: RedirectionServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', () => {
    expect(component.authUser).toEqual(mockUser);
    expect(component.isDataSaved()).toBe(true);
  });
});

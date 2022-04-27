import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IExistingUser } from 'src/app/models/IExistingUser';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss']
})
export class NavbarUserComponent implements OnInit, OnDestroy {
  @Input() url$!: BehaviorSubject<string>;
  
  private notifier: Subject<void> = new Subject<void>();
  public authUser!: IExistingUser;
  public className!: string;

  constructor(
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.usersService.authUser$
      .pipe(takeUntil(this.notifier))
      .subscribe(user => this.authUser = user);
    this.url$
      .pipe(takeUntil(this.notifier))
      .subscribe(path => {
        this.className = path === `/user/${this.authUser?.username}` ? 'selected' : '';
      });
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }
}

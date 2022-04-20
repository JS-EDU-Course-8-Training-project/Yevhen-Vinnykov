import { Component, OnInit, Input } from '@angular/core';
import { IExistingUser } from 'src/app/models/IExistingUser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() authUser!: IExistingUser;
  constructor() { }

  ngOnInit(): void {
  }

}

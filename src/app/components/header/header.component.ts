import { Component, OnInit, Input } from '@angular/core';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends TestedComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}

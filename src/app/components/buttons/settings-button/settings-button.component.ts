import { Component } from '@angular/core';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-settings-button',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss', '../buttons.scss'],
})
export class SettingsButtonComponent extends TestedComponent {}

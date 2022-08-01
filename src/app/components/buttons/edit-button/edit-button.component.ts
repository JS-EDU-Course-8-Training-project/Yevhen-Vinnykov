import { Component, Input } from '@angular/core';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss', '../buttons.scss'],
})
export class EditButtonComponent extends TestedComponent {
  @Input() slug!: string;
}

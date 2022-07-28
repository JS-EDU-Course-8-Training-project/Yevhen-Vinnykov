import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss', '../buttons.scss'],
})
export class EditButtonComponent {
  @Input() slug!: string;
}

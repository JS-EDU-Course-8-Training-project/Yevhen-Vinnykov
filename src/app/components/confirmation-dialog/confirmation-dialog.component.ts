import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { TestedComponent } from 'src/app/shared/tests/TestedComponent';

interface IData {
  title: string;
  subtitle: string;
  confirmButtonText: string;
  cancelButtonText: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent extends TestedComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IData) {
    super();
  }
}

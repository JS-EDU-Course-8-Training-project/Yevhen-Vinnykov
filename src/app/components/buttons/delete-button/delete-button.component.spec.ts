import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of } from 'rxjs';
import { ArticlesService } from 'src/app/shared/services/articles/articles.service';
import { RedirectionService } from 'src/app/shared/services/redirection/redirection.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

import { DeleteButtonComponent } from './delete-button.component';
import { DeleteButtonStore } from './delete-button.store';

class RedirectionServiceMock {
  public redirectHome = () => new Promise<boolean>((resolve) => resolve(true));
}

class ArticlesServiceMock {
  public deleteArticle = () => new Promise<void>((resolve) => resolve());
}

class DeleteButtonStoreMock {
  public isLoading$ = new BehaviorSubject<boolean>(false);
}

class MatDialogMock {
  open = () => ({ afterClosed: () => of({ action: true }) });
}

describe('DELETE BUTTON COMPONENT', () => {
  let component: DeleteButtonComponent;
  let fixture: ComponentFixture<DeleteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteButtonComponent, ConfirmationDialogComponent],
      imports: [MatDialogModule, BrowserAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            data: {
              title: 'Are you sure you want to delete this article?',
              subtitle: 'It cannot be restored',
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
            },
          },
        },
        { provide: RedirectionService, useClass: RedirectionServiceMock },
        { provide: ArticlesService, useClass: ArticlesServiceMock },
        { provide: DeleteButtonStore, useClass: DeleteButtonStoreMock },
        { provide: MatDialog, useClass: MatDialogMock },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteButtonComponent);
    component = fixture.componentInstance;
    component.slug = 'test';
    fixture.detectChanges();
  });

  it('deleteArticle() should be invoked on button click', () => {
    const spy = spyOn(component, 'deleteArticle').and.callThrough();
    const deleteButton = fixture.debugElement.query(By.css('button'));
    deleteButton.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalled();
  });
});

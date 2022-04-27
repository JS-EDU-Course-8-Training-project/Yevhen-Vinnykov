import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ISavedData } from 'src/app/shared/models/ISavedData';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationGuard implements CanDeactivate<ISavedData> {
  constructor(private dialog: MatDialog) {}
  canDeactivate(
    component: ISavedData,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!component.isDataSaved()){
          const dialogRef = this.dialog.open(ConfirmationDialogComponent);
          return dialogRef.afterClosed();
      }
    return of(true);
  }
  
}

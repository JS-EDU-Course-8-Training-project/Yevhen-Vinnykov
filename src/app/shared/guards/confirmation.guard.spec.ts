import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';

import { ConfirmationGuard } from './confirmation.guard';

class DialogMock {
  public open = () => ({
    afterClosed: () => of(false)
  });
}

const componentStub = {
  isDataSaved: () => true
};

describe('CONFIRMATION GUARD', () => {
  let guard: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfirmationGuard,
        { provide: MatDialog, useClass: DialogMock }
      ]
    });
    guard = TestBed.inject(ConfirmationGuard);
  });

  it('should allow deactivation', () => {
    guard.canDeactivate(componentStub).subscribe((res: boolean) => {
      expect(res).toBe(true);
    });
  });

  it('should not allow deactivation', () => {
    const componentStub = { isDataSaved: () => false };

    guard.canDeactivate(componentStub).subscribe((res: boolean) => {
      expect(res).toBe(false);
    });
  });
});

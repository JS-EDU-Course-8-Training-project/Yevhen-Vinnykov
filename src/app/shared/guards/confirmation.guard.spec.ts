import { MatDialog } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';

import { ConfirmationGuard } from './confirmation.guard';

class DialogMock {
  public open = () => ({
    afterClosed: () => false
  });
}

const componentStub = {
  isDataSaved: () => true
};

describe('ConfirmationGuard', () => {
  let guard: any; //ConfirmationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfirmationGuard,
        { provide: MatDialog, useClass: DialogMock }
      ]
    });
    guard = TestBed.inject(ConfirmationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow deactivation', () => {
    guard.canDeactivate(componentStub).subscribe((res: boolean) => {
      expect(res).toBe(true);
    });
  });

  it('should not allow deactivation', () => {
    const componentStub = { isDataSaved: () => false };
    expect(guard.canDeactivate(componentStub)).toBe(false);
  });

});

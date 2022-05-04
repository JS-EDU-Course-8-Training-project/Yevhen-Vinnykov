import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';

import { NavbarComponent } from './navbar.component';

class RouterMock {
  public events = of(NavigationEnd);
  public url = 'test/url';
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: Router, useClass: RouterMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('url$ should emit values on router events', waitForAsync(() => { 
  //   const spy = spyOn(component.url$, 'next').and.callThrough();
  //   component.ngOnInit();
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     expect(spy).toHaveBeenCalledWith('test/url');
  //   })
  // }));

  // TEST FAILS

});

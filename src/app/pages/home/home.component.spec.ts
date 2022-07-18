import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { AuthorizationService } from 'src/app/shared/services/authorization/authorization.service';

class AuthServiceMock {
  public isAuthorized$ = of(true);
}

describe('HOME COMPONENT', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [{ provide: AuthorizationService, useClass: AuthServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select tag', () => {
    const spy = spyOn(component, 'handleSelectTag').and.callThrough();
    component.handleSelectTag('test');
    expect(component.selectedTag).toBe('test');
    expect(component.tabIndex).toBe(2);
    expect(spy).toHaveBeenCalledOnceWith('test');
  });

  it('should change tab index and', () => {
    const spy = spyOn(component, 'handleTabChange').and.callThrough();
    component.handleSelectTag('test');
    component.handleTabChange(2);
    expect(component.tabIndex).toBe(2);
    expect(component.selectedTag).toBe('test');
    expect(spy).toHaveBeenCalledOnceWith(2);
  });

  it('should change tab index and set tag to null', () => {
    const spy = spyOn(component, 'handleTabChange').and.callThrough();
    component.handleSelectTag('test');
    component.handleTabChange(1);
    expect(component.tabIndex).toBe(1);
    expect(component.selectedTag).toBe(null);
    expect(spy).toHaveBeenCalledOnceWith(1);
  });
});

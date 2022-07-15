import { apiBaseUrl } from 'cypress/support/apiBaseUrl';
import { settingsForm } from 'cypress/support/comonent-objects/user/settings-form';

import { user } from 'cypress/fixtures/user';

describe('SETTINGS FORM', () => {
  beforeEach(() => {
    cy.addTokenToLocalStorage();
    cy.intercept('GET', `${apiBaseUrl}users`, { user });
    cy.visit('/settings');
  });

  it('should have inputs filled with user information', () => {
    settingsForm.username.should('contain.value', user.username);
    settingsForm.email.should('contain.value', user.email);
    settingsForm.image.should('contain.value', user.image);
    settingsForm.bio.should('contain.value', user.bio);
  });

  it('should have errors if required inputs are empty', () => {
    settingsForm.username.clear().blur();
    settingsForm.email.clear().blur();

    settingsForm.formError.should('contain.text', 'This field is required');
  });

  it('should have an error if the email is invalid', () => {
    settingsForm.email.clear().type('invalid email');
    settingsForm.formError.should('contain.text', 'Enter a valid email');
  });

  it('should redirect to user page if the user was successfully updated', () => {
    cy.intercept('PUT', `${apiBaseUrl}users`, { user });

    settingsForm.bio.clear().type('new bio');
    settingsForm.updateButton.click();

    cy.location('pathname').should('eq', `/user/${user.username}`);
  });

  it('should logout and redirect to home page', () => {
    settingsForm.logoutButton.click().then(() => {
      cy.location('pathname').should('eq', '/');
      expect(window.localStorage.getItem('token')).to.eq(null);
    });
  });
});

import { settingsForm } from "cypress/support/comonent-objects/user/settings-form";

describe('SETTINGS FORM', () => {
    beforeEach(() => {
        cy.login();
        cy.intercept('GET', 'http://localhost:3000/api/users', {fixture: 'user.json'}).as('getUser');
        cy.visit('/settings');
    });

    it('should have inputs filled with user information', () => {
        settingsForm.username.should('contain.value', 'John');
        settingsForm.email.should('contain.value', 'john@gmail.com');
        settingsForm.image.should('contain.value', 'https://st3.depositphotos.com/2229436/13671/v/600/depositphotos_136717406-stock-illustration-flat-user-icon-member-sign.jpg');
        settingsForm.bio.should('contain.value', 'test');
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
        cy.intercept('PUT', 'http://localhost:3000/api/users', {fixture: 'user.json'}).as('updateUser');

        settingsForm.bio.clear().type('new bio');
        settingsForm.updateButton.click();

        cy.location('pathname').should('contain', '/user');
    });

    it('should logout and redirect to home page', () => {
        settingsForm.logoutButton.click().then(() => {
            cy.location('pathname').should('eq', '/');
            expect(window.localStorage.getItem('token')).to.eq(null);
        });
    });
});

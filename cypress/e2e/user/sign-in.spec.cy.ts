import { signInPage } from '../../support/comonent-objects/user/sign-in-page';

describe('SING IN PAGE', () => {

    beforeEach(() => {
        cy.visit('/sign-in');
    });

    it('should have a title and a link redirect to the sign up page', () => {
        signInPage.title.should('have.text', 'Sign In');

        signInPage.signUpLink
            .should('include.text', 'Need an account?')
            .and('have.attr', 'href', '/sign-up');
    });

    describe('SIGN-IN BUTTON', () => {
        it('should be disabled if the form is empty', () => {
            signInPage.signInButton.should('be.disabled');
        });

        it('should be disabled if the form is invalid', () => {
            signInPage.email.type('invalid email');
            signInPage.password.type('invld');

            signInPage.signInButton.should('be.disabled');
        });

        it('should be enabled if the form is valid', () => {
            signInPage.email.type('johndoe@email.com');
            signInPage.password.type('JohnDoe1');

            signInPage.signInButton.should('be.enabled');
        });
    });

    describe('SIGN-IN FORM', () => {
        it('should have valid class if the inputs are valid', () => {
            signInPage.email
                .type('johndoe@email.com')
                .blur()
                .should('have.class', 'ng-valid');

            signInPage.password
                .type('JohnDoe1')
                .blur()
                .should('have.class', 'ng-valid');
        });

        it('should redirect to home if the the credentials are valid', () => {
            signIn('john@example.com', 'Password1');

            cy.location('pathname').should('eq', '/');
        });

        describe('ERRORS', () => {
            it('should have a required error if the fields are touched and empty', () => {
                signInPage.email.type('johndoe@email.com').clear().blur();
                signInPage.formError.should('contain.text', 'This field is required');

                signInPage.password.type('JohnDoe1').clear().blur();
                signInPage.formError.should('contain.text', 'Password must be at least 6 characters long');
            });

            it('should have an invalid error if the fields are touched and invalid', () => {
                signInPage.email.type('invalid email');
                signInPage.formError.should('contain.text', 'Enter a valid email');

                signInPage.password.type('1111').blur();
                signInPage.formError.should('contain.text', 'Password must be at least 6 characters long');
            });

            it('should show an error if the user doesn\'t exist', () => {
                signIn('userdoesntexist@gmail.com', 'Password1');

                signInPage.formError.should('contain.text', ' Error:  User not found ');
            });

            it('should show an error if the password is not correct', () => {
                signIn('john@example.com', 'WrongPassword');

                signInPage.formError.should('contain.text', ' Error:  Email or password is not valid ');
            });
        });
    });
});

const signIn = (email: string, password: string) => {
    signInPage.email.clear().type(email);
    signInPage.password.clear().type(password);
    
    signInPage.signInButton.click();
}
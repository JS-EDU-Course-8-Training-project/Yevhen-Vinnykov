import { signUpPage } from "cypress/support/comonent-objects/user/sign-up-page";

describe('SING UP PAGE', () => {
    beforeEach(() => {
        cy.visit('/sign-up');
    });

    it('should have a title and a link redirect to the sign in page', () => {
        signUpPage.title.should('have.text', 'Sign Up');

        signUpPage.signInLink
            .should('have.text', ' Already have an account? ')
            .and('have.attr', 'href', '/sign-in');
    });

    describe('SIGN-UP BUTTON', () => {
        it('should be disabled if the form is empty', () => {
            signUpPage.signUpButton.should('be.disabled');
        });

        it('should be disabled if the form is invalid', () => {
            signUpPage.email.type('invalid email');
            signUpPage.password.type('invld');

            signUpPage.signUpButton.should('be.disabled');
        });

        it('should be enabled if the form is valid', () => {
            signUpPage.username.type('John');
            signUpPage.email.type('johndoe@email.com');
            signUpPage.password.type('JohnDoe1');

            signUpPage.signUpButton.should('be.enabled');
        });
    });

    describe('SIGN-UP FORM', () => {
        it('inputs should have valid class if they are valid', () => {            
            signUpPage.username
                .type('John')
                .blur()
                .should('have.class', 'ng-valid');

            signUpPage.email
                .type('johndoe@gmail.com')
                .blur()
                .should('have.class', 'ng-valid');

            signUpPage.password
                .type('JohnDoe1')
                .blur()
                .should('have.class', 'ng-valid');
        });

        it('should redirect to home if the the credentials are valid', () => {
            cy.intercept('POST', 'http://localhost:3000/api/users/signup', {fixture: 'authUser.json'}).as('signUp');
            
            signUp('Jane', 'janedoe@gmail.com', 'JaneDoe1');

            cy.location('pathname').should('eq', '/');
        });

        describe('ERRORS', () => {
            it('should have a required error span if the fields are touched and empty', () => {
                signUpPage.username.type('John').clear().blur();
                signUpPage.formError.should('contain', 'This field is required');
    
                signUpPage.email.type('johndoe@email.com').clear().blur();
                signUpPage.formError.should('contain', 'This field is required');
    
                signUpPage.password.type('JohnDoe1').clear().blur();
                signUpPage.formError.should('contain', 'Password must be at least 6 characters long');
            });
    
            it('should have an invalid error span if the fields are touched and invalid', () => {
                signUpPage.email.type('invalid email').blur();
                signUpPage.formError.should('contain', 'Enter a valid email');
    
                signUpPage.password.type('11111').blur();
                signUpPage.formError.should('contain', 'Password must be at least 6 characters long');
            });

            it('should show an error if the username is taken', () => {
                signUp('John', 'johndoe@email.com', '111111');
                
                signUpPage.formError.should('contain.text', ' Error:  User with this username already exists ');
            });

            it('should show an error if the email is taken', () => {
                signUp('Jack', 'john@example.com', '111111');

                signUpPage.formError.should('contain.text', ' Error:  User with this email already exists ');
            });

            it('should show an error if the password does not contain at least one digit', () => {
                signUp('Joey', 'joey@email.com', 'password');

                signUpPage.formError.should('contain.text', ' Error:  Password must contain at least one digit ');
            });

            it('should show an error if the password does not contain at least one capital letter', () => {
                signUp('Joey', 'joey@email.com', 'password1');

                signUpPage.formError.should('contain.text', ' Error:  Password must contain at least one capital letter ');
            });
        });
    });
});

const signUp = (username: string, email: string, password: string) => {
    signUpPage.username.clear().type(username);
    signUpPage.email.clear().type(email);
    signUpPage.password.clear().type(password);

    signUpPage.signUpButton.click();
}
describe('SING UP PAGE', () => {
    beforeEach(() => {
        cy.visit('/sign-up');
    });

    beforeEach(() => {
        cy.get('[data-angular="sign-up-button"]').as('signUpBtn');
    });

    it('should have a title and a link redirect to the sign in page', () => {
        cy.get('h2').should('have.text', 'Sign Up');

        cy.get('form').find('[data-angular="sign-in-link"]')
            .should('have.text', ' Already have an account? ')
            .and('have.attr', 'href', '/sign-in');
    });

    describe('SIGN-UP BUTTON', () => {
        it('should be disabled if the form is empty', () => {
            cy.get('@signUpBtn').should('be.disabled');
        });

        it('should be disabled if the form is invalid', () => {
            cy.get('#email').type('invalid email');
            cy.get('#password').type('invld');

            cy.get('@signUpBtn').should('be.disabled');
        });

        it('should be enabled if the form is valid', () => {
            cy.get('#username').type('John');
            cy.get('#email').type('johndoe@email.com');
            cy.get('#password').type('JohnDoe1');

            cy.get('@signUpBtn').should('not.be.disabled');
        });
    });

    describe('SIGN-UP FORM', () => {
        it('should have green left borders if the inputs are valid', () => {
            const [cssProp, cssValue] = ['border-left', '5px solid rgb(66, 169, 72)'];
            
            cy.get('#username')
                .type('John')
                .blur()
                .should('have.css', cssProp, cssValue);

            cy.get('#email')
                .type('johndoe@gmail.com')
                .blur()
                .should('have.css', cssProp, cssValue);

            cy.get('#password')
                .type('JohnDoe1')
                .blur()
                .should('have.css', cssProp, cssValue);
        });

        it('should redirect to home if the the credentials are valid', () => {
            cy.intercept('POST', 'http://localhost:3000/api/users/signup', {fixture: 'authUser.json'}).as('signUp');

            cy.get('#username').type('Jane');
            cy.get('#email').type('janedoe@gmail.com');
            cy.get('#password').type('JaneDoe1');
            cy.get('@signUpBtn').click();

            cy.location('pathname').should('eq', '/');
        });

        describe('ERRORS', () => {
            const errorSpan = '[data-angular="form-error"]';

            it('should have a required error span if the fields are touched and empty', () => {
                cy.get('#username').type('John').clear().blur();
                cy.get(errorSpan).should('contain', 'This field is required');
    
                cy.get('#email').type('johndoe@email.com').clear().blur();
                cy.get(errorSpan).should('contain', 'This field is required');
    
                cy.get('#password').type('JohnDoe1').clear().blur();
                cy.get(errorSpan).should('contain', 'Password must be at least 6 characters long');
            });
    
            it('should have an invalid error span if the fields are touched and invalid', () => {
                cy.get('#email').type('invalid email').blur();
                cy.get(errorSpan).should('contain', 'Enter a valid email');
    
                cy.get('#password').type('11111').blur();
                cy.get(errorSpan).should('contain', 'Password must be at least 6 characters long');
            });

            it('should show an error if the username is taken', () => {
                cy.get('#username').type('John');
                cy.get('#email').type('johndoe@email.com');
                cy.get('#password').type('111111');
    
                cy.get('@signUpBtn').click();
                cy.get(errorSpan).should('contain.text', ' Error:  User with this username already exists ');
            });

            it('should show an error if the email is taken', () => {
                cy.get('#username').type('Jack');
                cy.get('#email').type('john@example.com');
                cy.get('#password').type('111111');
    
                cy.get('@signUpBtn').click();
                cy.get(errorSpan).should('contain.text', ' Error:  User with this email already exists ');
            });

            it('should show an error if the password does not contain at least one digit', () => {
                cy.get('#username').type('Joey');
                cy.get('#email').type('joey@example.com');
                cy.get('#password').type('password');
    
                cy.get('@signUpBtn').click();
                cy.get(errorSpan).should('contain.text', ' Error:  Password must contain at least one digit ');
            });

            it('should show an error if the password does not contain at least one capital letter', () => {
                cy.get('#username').type('Joey');
                cy.get('#email').type('joey@example.com');
                cy.get('#password').type('password1');
    
                cy.get('@signUpBtn').click();
                cy.get(errorSpan).should('contain.text', ' Error:  Password must contain at least one capital letter ');
            });
        });
    });
});

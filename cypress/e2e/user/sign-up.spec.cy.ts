describe('SING UP PAGE', () => {
    beforeEach(() => {
        cy.visit('/sign-up');
    });

    it('should have a title', () => {
        cy.get('.form-group > h1').should('have.text', 'Sign Up');
    });

    it('should have a link redirect to the sign in page', () => {
        cy.get('.form-group > a')
            .should('have.text', 'Already have an account?')
            .and('have.attr', 'href', '/sign-in');
    });

    describe('SIGN-UP BUTTON', () => {
        it('should be disabled if the form is empty', () => {
            cy.get('button').should('be.disabled');
        });

        it('should be disabled if the form is invalid', () => {
            cy.get('#email').type('invalid email');
            cy.get('#password').type('invld');
            cy.get('button').should('be.disabled');
        });

        it('should be enabled if the form is valid', () => {
            cy.get('#username').type('John');
            cy.get('#email').type('johndoe@email.com');
            cy.get('#password').type('JohnDoe1');
            cy.get('button').should('not.be.disabled');
        });
    });

    describe('SIGN-UP FORM', () => {
        it('should have a required error span if the fields are touched and empty', () => {
            cy.get('#username').type('John').clear();
            cy.get('#email').type('johndoe@email.com').clear();
            cy.get('#password').type('JohnDoe1').clear().blur();

            cy.get('.form-error')
                .eq(0)
                .should('be.visible')
                .and('contain', 'This field is required');
            cy.get('.form-error')
                .eq(1)
                .should('be.visible')
                .and('contain', 'This field is required');
            cy.get('.form-error')
                .eq(2)
                .should('be.visible')
                .and('contain', 'Password must be at least 6 characters long');
        });

        it('should have an invalid error span if the fields are touched and invalid', () => {
            cy.get('#email').type('invalid email');
            cy.get('#password').type('11111').blur();

            cy.get('.form-error')
                .eq(0)
                .should('be.visible')
                .and('contain', 'Enter a valid email');
            cy.get('.form-error')
                .eq(1)
                .should('be.visible')
                .and('contain', 'Password must be at least 6 characters long');
        });

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
            cy.intercept('POST', 'http://localhost:3000/api/users/signup', { fixture: 'authUser.json' }).as('signUp');

            cy.get('#username').type('Jane');
            cy.get('#email').type('janedoe@gmail.com');
            cy.get('#password').type('JaneDoe1');
            cy.get('button').click();

            cy.location('pathname').should('eq', '/');
        });
    });
})

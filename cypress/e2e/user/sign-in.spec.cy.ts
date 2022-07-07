describe('SING IN PAGE', () => {
    beforeEach(() => {
        cy.visit('/sign-in');
    });

    it('should have a title', () => {
        cy.get('h2').should('have.text', 'Sign In');
    });

    it('should have a link redirect to the sign up page', () => {
        cy.get('form').find('[data-angular="sign-up-link"]')
            .should('have.text', ' Need an account? ')
            .and('have.attr', 'href', '/sign-up');
    });

    describe('SIGN-IN BUTTON', () => {
        beforeEach(() => {
            cy.get('[data-angular="sign-in-button"]').as('signInBtn');
        });

        it('should be disabled if the form is empty', () => {
            cy.get('@signInBtn').should('be.disabled');
        });

        it('should be disabled if the form is invalid', () => {
            cy.get('#email').type('invalid email');
            cy.get('#password').type('invld');
            cy.get('@signInBtn').should('be.disabled');
        });

        it('should be enabled if the form is valid', () => {
            cy.get('#email').type('johndoe@email.com');
            cy.get('#password').type('JohnDoe1');
            cy.get('@signInBtn').should('not.be.disabled');
        });
    });

    describe('SIGN-IN FORM', () => {
        it('should have a required error span if the fields are touched and empty', () => {
            cy.get('#email').type('johndoe@email.com').clear().blur();
            cy.get('[data-angular="form-error"]').should('contain', 'This field is required');

            cy.get('#password').type('JohnDoe1').clear().blur();
            cy.get('[data-angular="form-error"]').should('contain', 'Password must be at least 6 characters long');
        });

        it('should have an invalid error span if the fields are touched and invalid', () => {
            cy.get('#email').type('invalid email');
            cy.get('[data-angular="form-error"]').should('contain', 'Enter a valid email');

            cy.get('#password').type('1111').blur();
            cy.get('[data-angular="form-error"]').should('contain', 'Password must be at least 6 characters long');
        });

        it('should have green left borders if the inputs are valid', () => {
            const [cssProp, cssValue] = ['border-left', '5px solid rgb(66, 169, 72)'];
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
            cy.get('#email').type('john@example.com');
            cy.get('#password').type('Password1');
            cy.get('[data-angular="sign-in-button"]').click();

            cy.location('pathname').should('eq', '/');
        });
    });
});

describe('SETTINGS PAGE', () => {
    beforeEach(() => {
        cy.login();
        cy.visit('/settings');
    });

    describe('SETTINGS FORM', () => {
        it('should have fields filled with user information', () => {
            cy.get('#username').should('contain.value', 'John');
            cy.get('#email').should('contain.value', 'john@example.com');
            cy.get('#image').should('contain.value', 'https://st3.depositphotos.com/2229436/13671/v/600/depositphotos_136717406-stock-illustration-flat-user-icon-member-sign.jpg');
            cy.get('#bio').should('contain.value', 'bio');
        });

        it('should have errors if required fields are empty', () => {
            const requiredFields = ['#username', '#email'];
            requiredFields.forEach(field => cy.get(field).clear().blur());

            requiredFields.forEach((field, i) => {
                cy.get('.form-error').eq(i).should('contain.text', 'This field is required');
            });
        });

        it('should have an error if the email is invalid', () => {
            cy.get('#email').clear().type('invalid email');
            cy.get('.form-error').eq(0).should('contain.text', 'Enter a valid email');
        });

        it('should redirect to user page if the user was successfully updated', () => {
            cy.get('#bio').clear().type('new bio');
            cy.get('button').contains('Update').click();

            cy.location('pathname').should('contain', '/user');
        });

        it('should logout and redirect to home page', () => {
            cy.get('button').contains('Logout').click().then(() => {
                cy.location('pathname').should('eq', '/');
                expect(window.localStorage.getItem('token')).to.eq(null);
            });
        });
    });
});

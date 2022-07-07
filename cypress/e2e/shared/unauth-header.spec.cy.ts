describe('HEADER WHEN UNAUTHORIZED', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    beforeEach(() => {
        cy.get('[data-angular="home-link"]').as('homeLink');
        cy.get('[data-angular="sign-in-link"]').as('signInLink');
        cy.get('[data-angular="sign-up-link"]').as('signUpLink');
    });

    it('should have title', () => {
        cy.get('[data-angular="app-title"]')
            .should('contain.text', 'Real World')
            .parent()
            .should('have.attr', 'href', '/');
    });

    it('should have home, sign-in and sign-up buttons', () => {
        cy.get('@homeLink')
            .should('have.class', 'selected')
            .and('contain.text', ' Home ')
            .and('have.attr', 'href', '/');

        cy.get('@signInLink')
            .should('contain.text', ' Sign in ')
            .and('have.attr', 'href', '/sign-in');

        cy.get('@signUpLink')
            .should('contain.text', ' Sign up ')
            .and('have.attr', 'href', '/sign-up');
    });

    it('links should redirect when clicked and add selected class', () => {
        cy.get('@signInLink').click().should('have.class', 'selected');
        cy.location('pathname').should('contain', '/sign-in');

        cy.get('@signUpLink').click().should('have.class', 'selected');
        cy.location('pathname').should('contain', '/sign-up');

        cy.get('@homeLink').click().should('have.class', 'selected');
        cy.location('pathname').should('contain', '/');
    });

    it('should not have new article, settings and user buttons', () => {
        cy.get('[data-angular="new-article-link"]').should('not.exist');
        cy.get('[data-angular="settings-link"]').should('not.exist');
        cy.get('app-navbar-user').should('not.exist');
    });
});
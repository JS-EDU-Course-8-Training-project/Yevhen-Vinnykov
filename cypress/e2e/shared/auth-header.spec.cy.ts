describe('HEADER WHEN AUTHORIZED', () => {
    beforeEach(() => {
        cy.login();
        cy.visit('/');
    });

    beforeEach(() => {
        cy.get('[data-angular="home-link"]').as('homeLink');
        cy.get('[data-angular="new-article-link"]').as('newArticleLink');
        cy.get('[data-angular="settings-link"]').as('settingsLink');
        cy.get('[data-angular="user-page-link"]').as('userPageLink');
    });

    it('should have home, new article, settings and user buttons', () => {
        cy.get('@homeLink')
            .should('have.class', 'selected')
            .and('contain.text', ' Home ')
            .and('have.attr', 'href', '/');

        cy.get('@newArticleLink')
            .should('contain.text', ' New Article ')
            .and('have.attr', 'href', '/create-article');

        cy.get('@settingsLink')
            .should('contain.text', ' Settings ')
            .and('have.attr', 'href', '/settings');

        cy.get('@userPageLink').should('have.attr', 'href', '/user/John');
    });

    it('links should redirect when clicked and add selected class', () => {
        cy.get('@newArticleLink').click().should('have.class', 'selected');
        cy.location('pathname').should('contain', '/create-article');

        cy.get('@settingsLink').click().should('have.class', 'selected');
        cy.location('pathname').should('contain', '/settings');

        cy.get('@userPageLink').click().should('have.class', 'selected');
        cy.location('pathname').should('contain', '/user/John');

        cy.get('@homeLink').click().should('have.class', 'selected');
        cy.location('pathname').should('contain', '/');
    });

    it('should not have sign-in and sign-up buttons', () => {
        cy.get('[data-angular="sign-in-link"]').should('not.exist');
        cy.get('[data-angular="sign-up-link"]').should('not.exist');
    });
});
describe('USER PAGE', () => {
    beforeEach(() => {
        cy.login();
        cy.visit('/user/John');
    });

    it('should have two tabs', () => {
        cy.get('[role="tab"]')
            .should('contain', 'My Articles')
            .and('contain', 'Favorited Articles');
    });

    it('tabs should switch when clicked', () => {
        cy.get('[role="tab"]')
            .contains('Favorited Articles')
            .click()
            .parent()
            .should('have.class', 'mat-tab-label-active');

        cy.get('[role="tab"]')
            .contains('My Articles')
            .click()
            .parent()
            .should('have.class', 'mat-tab-label-active');
    });

    it('if all articles have been loaded, finished div should be visible', () => {
        cy.get('.finished').should('be.visible');
    });

    describe('BANNER', () => {
        it('should have a user image, name and bio', () => {
            cy.get('[data-angular="user-page-banner"]').as('userBanner');

            cy.get('@userBanner').find('img').should('be.visible');
            cy.get('@userBanner').find('h3').should('be.visible');
            cy.get('@userBanner').find('p').should('be.visible');
        });

        it('should have a button that redirects to settings', () => {
            cy.get('[data-angular="update-button"]').click();

            cy.location('pathname').should('contain', '/settings');
        });
    });
});

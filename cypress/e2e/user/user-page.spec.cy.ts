describe('USER PAGE', () => {
    beforeEach(() => {
        cy.login();
        cy.visit('/user/John');
    });

    it('should have two tabs', () => {
        cy.get('.mat-tab-labels')
            .should('contain', 'My Articles')
            .and('contain', 'Favorited Articles');
    });

    it('tabs should switch when clicked', () => {
        cy.get('.mat-tab-labels > div')
        .eq(1)
        .click()
        .should('have.class', 'mat-tab-label-active');

        cy.get('.mat-tab-labels > div')
        .eq(0)
        .click()
        .should('have.class', 'mat-tab-label-active');

        cy.get('.mat-tab-labels > div').eq(1).should('not.have.class', 'mat-tab-label-active');
    });

    it('if all articles have been loaded, finished div should be visible', () => {
        cy.get('.finished').should('be.visible');
    });

    describe('BANNER', () => {
        it('should have a user image, name and bio', () => {
            cy.get('mat-card.user-banner > div').as('userBanner');
            
            cy.get('@userBanner').find('img').should('be.visible');
            cy.get('@userBanner').find(':nth-child(2)').should('be.visible');
            cy.get('@userBanner').find(':nth-child(3)').should('be.visible');
        });

        it('should have a button that redirects to settings', () => {
            cy.get('button').contains('Update Profile Settings').click();
            cy.location('pathname').should('contain', '/settings');
        });
    });
});

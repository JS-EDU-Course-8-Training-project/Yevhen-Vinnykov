import { userPage } from "cypress/support/comonent-objects/user/user-page";

describe('USER PAGE', () => {
    beforeEach(() => {
        cy.login();
        cy.visit('/user/John');
    });

    it('should have two tabs', () => {
        userPage.myArticlesTab.should('contain.text', 'My Articles');
        userPage.favoritedArticlesTab.should('contain.text', 'Favorited Articles');
    });

    it('tabs should switch when clicked', () => {
        userPage.favoritedArticlesTab
            .click()
            .should('have.class', 'mat-tab-label-active');

        userPage.myArticlesTab
            .click()
            .should('have.class', 'mat-tab-label-active');
    });

    it('if all articles have been loaded, finished div should be visible', () => {
        cy.getByTestAttr('all-articles-loaded').should('be.visible');
    });

    describe('BANNER', () => {
        it('should have a user image, name and bio', () => {
            cy.getByTestAttr('user-page-banner').should('be.visible');

            userPage.image.should('be.visible');
            userPage.username.should('be.visible');
            userPage.bio.should('be.visible');
        });

        it('should have a button that redirects to settings', () => {
            userPage.updateButton.click();

            cy.location('pathname').should('contain', '/settings');
        });
    });
});

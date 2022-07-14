import { apiBaseUrl } from "cypress/support/apiBaseUrl";
import { header } from "cypress/support/comonent-objects/shared/header";

describe('HEADER', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should have title', () => {
        header.title
            .should('contain.text', 'Real World')
            .parent()
            .should('have.attr', 'href', '/');
    });

    describe('WHEN UNAUTHORIZED', () => {
        it('should have home, sign-in and sign-up buttons', () => {
            header.homeLink
                .should('have.class', 'selected')
                .and('contain.text', ' Home ')
                .and('have.attr', 'href', '/');
    
            header.signInLink
                .should('contain.text', ' Sign in ')
                .and('have.attr', 'href', '/sign-in');
    
            header.signUpLink
                .should('contain.text', ' Sign up ')
                .and('have.attr', 'href', '/sign-up');
        });
    
        it('links should redirect when clicked and add selected class', () => {
            header.signInLink.click().should('have.class', 'selected');
            cy.location('pathname').should('contain', '/sign-in');
    
            header.signUpLink.click().should('have.class', 'selected');
            cy.location('pathname').should('contain', '/sign-up');
    
            header.homeLink.click().should('have.class', 'selected');
            cy.location('pathname').should('contain', '/');
        });
    
        it('should not have new article, settings and user buttons', () => {
            header.newArticleLink.should('not.exist');
            header.settingsLink.should('not.exist');
            header.userPageLink.should('not.exist');
        });
    });

    describe('WHEN AUTHORIZED', () => {
        const authUser = {username: 'John'};

        beforeEach(() => {
            cy.addTokenToLocalStorage();
            cy.intercept('GET', `${apiBaseUrl}users`, {fixture: 'user.json'});
            cy.visit('/');
        });
    
        it('should have home, new article, settings and user buttons', () => {
            header.itself.should('be.visible');
    
            header.homeLink
                .should('have.class', 'selected')
                .and('contain.text', ' Home ')
                .and('have.attr', 'href', '/');
    
            header.newArticleLink
                .should('contain.text', ' New Article ')
                .and('have.attr', 'href', '/create-article');
    
            header.settingsLink
                .should('contain.text', ' Settings ')
                .and('have.attr', 'href', '/settings');
    
            header.userPageLink
                .should('contain.text', `${authUser.username}`)
                .should('have.attr', 'href',`/user/${authUser.username}`);
        });
    
        it('links should redirect when clicked and add selected class', () => {
            header.newArticleLink.click().should('have.class', 'selected');
            cy.location('pathname').should('contain', '/create-article');
    
            header.settingsLink.click().should('have.class', 'selected');
            cy.location('pathname').should('contain', '/settings');
    
            header.userPageLink.click().should('have.class', 'selected');
            cy.location('pathname').should('contain', '/user/John');
    
            header.homeLink.click().should('have.class', 'selected');
            cy.location('pathname').should('contain', '/');
        });
    
        it('should not have sign-in and sign-up buttons', () => {
            header.signInLink.should('not.exist');
            header.signUpLink.should('not.exist');
        });
    })
});
import { eq } from "cypress/types/lodash";

describe('ARTICLE CARD', () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:3000/api/articles/?offset=0&limit=5', { fixture: "articles.json" })
            .as('getArticles');
        cy.intercept('GET', 'http://localhost:3000/api/tags', { fixture: "tags.json" })
            .as('getTags');
        cy.visit('/');
    });

    beforeEach(() => {
        cy.get('[data-angular="article-card-info"]').as('infoDiv');
    });

    describe('HEADER', () => {
        it('it should have an info div with user name, image and created date', () => {
            cy.get('@infoDiv').find('img').should('be.visible');
            cy.get('@infoDiv').find('h3').should('be.visible');
            cy.get('@infoDiv').find('[data-angular="article-card-date"]').should('be.visible');
        });

        it('it should have a like button', () => {
            cy.get('[data-angular="article-card-like-btn"]').should('be.visible');
        });

        it('click on user image should redirect to login page if unauthorized', () => {
            cy.get('@infoDiv').find('img').eq(0).click();

            cy.location('pathname').should('contain', '/sign-in');
        });

        it('user name should redirect to login page if unauthorized', () => {
            cy.get('@infoDiv').find('h3').eq(0).click();

            cy.location('pathname').should('contain', '/sign-in');
        });
    });

    describe('BODY', () => {
        it('it should have an h2 with the article title', () => {
            cy.get('[data-angular="article-title"]').should('be.visible');
        });

        it('it should have a paragraph with the article description', () => {
            cy.get('[data-angular="article-card-description"]').should('be.visible');
        });
    });

    describe('FOOTER', () => {
        beforeEach(() => {
            cy.get('[data-angular="article-card-footer"]').as('footer');
        });
        it('it should have a footer with read more link and tags', () => {
            cy.get('@footer').find('a').should('have.attr', 'href');
            cy.get('[data-angular="article-card-tags"]').should('be.visible');
        });

        it('it redirect to article page when read more is clicked', () => {
            cy.intercept('GET', 'http://localhost:3000/api/articles/**', {fixture: 'favoritedArticle.json'});
            cy.get('@footer').find('a').eq(0).click();

            cy.location('pathname').should('contain', '/article');
        });
    });
});

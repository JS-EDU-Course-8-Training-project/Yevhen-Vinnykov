import { articleCard } from './../../support/component-objects/article-card';

describe('ARTICLE CARD', () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:3000/api/articles/?offset=0&limit=5', { fixture: "articles.json" })
            .as('getArticles');
        cy.intercept('GET', 'http://localhost:3000/api/tags', { fixture: "tags.json" })
            .as('getTags');
        cy.visit('/');
    });

    describe('HEADER', () => {
        it('it should have an info div with user name, image and created date', () => {
            articleCard.authorImage.should('be.visible');
            articleCard.authorName.should('be.visible');
            articleCard.date.should('be.visible');
        });

        it('it should have a like button', () => {
            articleCard.likeButton.should('be.visible');
        });

        it('click on user image should redirect to login page if unauthorized', () => {
            articleCard.authorImage.click();

            cy.location('pathname').should('contain', '/sign-in');
        });

        it('user name should redirect to login page if unauthorized', () => {
            articleCard.authorName.click();

            cy.location('pathname').should('contain', '/sign-in');
        });
    });

    describe('BODY', () => {
        it('it should have an h2 with the article title', () => {
            articleCard.title.should('be.visible');
        });

        it('it should have a paragraph with the article description', () => {
            articleCard.description.should('be.visible');
        });
    });

    describe('FOOTER', () => {
        it('it should have a footer with read more link and tags', () => {
            articleCard.readMoreLink.should('have.attr', 'href');
            articleCard.articleTags.should('be.visible');
        });

        it('it redirect to article page when read more is clicked', () => {
            cy.intercept('GET', 'http://localhost:3000/api/articles/**', {fixture: 'favoritedArticle.json'});
            articleCard.readMoreLink.click();

            cy.location('pathname').should('contain', '/article');
        });
    });
});

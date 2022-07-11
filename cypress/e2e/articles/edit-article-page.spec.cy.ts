import { newArticlePage as editArticlePage } from './../../support/page-objects/articles/new-article-page';

describe('NEW ARTICLE PAGE', () => {
    beforeEach(() => {
        cy.login();
        cy.createOwnArticle();
        cy.visit('/edit-article/MyArticle');
    });

    it('inputs should have valid class and have values', () => {
        editArticlePage.title
            .should('have.class', 'ng-valid')
            .and('contain.value', 'MyArticle');

        editArticlePage.description
            .should('have.class', 'ng-valid')
            .and('contain.value', 'My test article');

        editArticlePage.body
            .should('have.class', 'ng-valid')
            .and('contain.value', 'My test article');

        editArticlePage.tagList
            .should('have.class', 'ng-valid')
            .and('contain.value', 'tag');
    });

    it('should redirect to article page if updated successfully', () => {
        cy.intercept('PUT', 'http://localhost:3000/api/articles/MyArticle', {fixture: 'unfavoritedArticle.json'});
        cy.intercept('GET', 'http://localhost:3000/api/articles/**', {fixture: 'unfavoritedArticle.json'});

        editArticlePage.title.clear().type('Them and green firmament had');

        editArticlePage.publishButton.click();
        cy.location('pathname').should('contain', '/article');
     });
});

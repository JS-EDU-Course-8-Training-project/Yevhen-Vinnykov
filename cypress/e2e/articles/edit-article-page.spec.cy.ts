import { apiBaseUrl } from 'cypress/support/apiBaseUrl';
import { newArticlePage as editArticlePage } from '../../support/comonent-objects/articles/new-article-page';

describe('NEW ARTICLE PAGE', () => {
    beforeEach(() => {
        cy.addTokenToLocalStorage();
        
        cy.fixture('articles').then(res => {
            const article = res.articles[0];
            cy.intercept('GET', `${apiBaseUrl}articles/Lorem`, {article}).as('getArticle');
        });

        cy.visit('/edit-article/Lorem');
    });

    it('inputs should have valid class and have values', () => {
        editArticlePage.title
            .should('have.class', 'ng-valid')
            .and('contain.value', 'Lorem');

        editArticlePage.description
            .should('have.class', 'ng-valid')
            .and('contain.value', 'Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u');

        editArticlePage.body
            .should('have.class', 'ng-valid')
            .and('include.value', 'Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u.');

        editArticlePage.tagList
            .should('have.class', 'ng-valid')
            .and('contain.value', 'lorem');
    });

    it('should redirect to article page if updated successfully', () => {
        cy.fixture('articles').then(res => {
            const article = res.articles[0];  
            cy.intercept('PUT', `${apiBaseUrl}articles/Lorem`, {article}).as('editArticle');        
        });

        cy.fixture('articles').then(res => {
            const article = res.articles[0];
            article.title = 'My new title';

            cy.intercept('GET', `${apiBaseUrl}articles/**`, {article}).as('getArticle');
        });

        editArticlePage.title.clear().type('My new title');
        editArticlePage.publishButton.click();
        
        cy.location('pathname').should('contain', '/article');
     });
});

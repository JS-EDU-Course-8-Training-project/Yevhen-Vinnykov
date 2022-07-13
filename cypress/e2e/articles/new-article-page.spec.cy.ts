import { newArticlePage } from '../../support/comonent-objects/articles/new-article-page';

describe('NEW ARTICLE PAGE', () => {
    beforeEach(() => {
        cy.login();
        cy.visit('/create-article');
    });

    describe('PUBLISH BUTTON', () => {
        it('should be disabled if the form is empty', () => {
            newArticlePage.publishButton.should('be.disabled');
        });

        it('should be enabled if the form is valid', () => {
            fillFormInputs();
            newArticlePage.publishButton.should('be.enabled');
        });
    });

    describe('NEW ARTICLE FORM', () => {
        it('should have a required error span if the fields are touched and empty', () => {
            fillFormInputs();
            clearFormInputs();

           newArticlePage.formError.should('contain.text', 'This field is required');
        });

        it('inputs should have valid class if they are valid', () => {
            fillFormInputs();

            newArticlePage.title.should('have.class', 'ng-valid');
            newArticlePage.description.should('have.class', 'ng-valid');
            newArticlePage.body.should('have.class', 'ng-valid');
            newArticlePage.tagList.should('have.class', 'ng-valid');
        });

        it('should redirect to article page if the article has been created', () => {
            cy.intercept('POST', 'http://localhost:3000/api/articles', { fixture: 'unfavoritedArticle.json' });
            cy.intercept('GET', 'http://localhost:3000/api/articles/**', { fixture: 'unfavoritedArticle.json' });

            fillFormInputs();
            newArticlePage.publishButton.click();

            cy.location('pathname').should('contain', '/article');
        });
    });
});

const fillFormInputs = () => {
    newArticlePage.title.type('test');
    newArticlePage.description.type('test');
    newArticlePage.body.type('test');
    newArticlePage.tagList.type('test');
}

const clearFormInputs = () => {
    newArticlePage.title.clear();
    newArticlePage.description.clear();
    newArticlePage.body.clear();
    newArticlePage.tagList.clear();
}
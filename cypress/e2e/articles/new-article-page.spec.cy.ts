import { apiBaseUrl } from 'cypress/support/apiBaseUrl';
import { newArticlePage } from '../../support/comonent-objects/articles/new-article-page';

import { ownArticle } from 'cypress/fixtures/articles';

describe('NEW ARTICLE PAGE', () => {
  beforeEach(() => {
    cy.addTokenToLocalStorage();
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
      cy.intercept('POST', `${apiBaseUrl}articles`, { article: ownArticle });
      cy.intercept('GET', `${apiBaseUrl}articles/**`, { article: ownArticle });

      fillFormInputs();
      newArticlePage.publishButton.click();

      cy.location('pathname').should('eq', '/article/Lorem');
    });
  });
});

const fillFormInputs = () => {
  newArticlePage.title.type(ownArticle.title);
  newArticlePage.description.type(ownArticle.description);
  newArticlePage.body.type(ownArticle.body);
  newArticlePage.tagList.type(ownArticle.tagList.join(', '));
};

const clearFormInputs = () => {
  newArticlePage.title.clear();
  newArticlePage.description.clear();
  newArticlePage.body.clear();
  newArticlePage.tagList.clear();
};

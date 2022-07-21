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

    it('should redirect to article page if the article has been created', () => {
      cy.intercept('POST', `${apiBaseUrl}articles`, { article: ownArticle });
      cy.intercept('GET', `${apiBaseUrl}articles/**`, { article: ownArticle });

      fillFormInputs();
      newArticlePage.publishButton.click();

      cy.location('pathname').should('eq', '/article/Lorem');
    });

    it('should have a button to add a tag input', () => {
      newArticlePage.tagList.should('have.length', 1);
      newArticlePage.addTagInputBtn.click();
      newArticlePage.tagList.should('have.length', 2);
    });

    it('should have a button to delete a tag input', () => {
      newArticlePage.addTagInputBtn.click();
      newArticlePage.tagList.should('have.length', 2);
      newArticlePage.deleteTagInputBtn(0).click();
      newArticlePage.tagList.should('have.length', 1);
    });

    it("if there's one tag input, delete button should not exist", () => {
      newArticlePage.tagList.should('have.length', 1);
      newArticlePage.deleteTagInputBtn().should('not.exist');
    });
  });
});

const fillFormInputs = () => {
  newArticlePage.title.type(ownArticle.title);
  newArticlePage.description.type(ownArticle.description);
  newArticlePage.body.type(ownArticle.body);
  newArticlePage.image.type(ownArticle.image);
  newArticlePage.tagList.type(ownArticle.tagList.join(', '));
};

const clearFormInputs = () => {
  newArticlePage.title.clear();
  newArticlePage.description.clear();
  newArticlePage.body.clear();
  newArticlePage.image.clear();
  newArticlePage.tagList.clear();
};

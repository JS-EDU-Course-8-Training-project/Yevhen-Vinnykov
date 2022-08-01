import { apiBaseUrl } from 'cypress/support/apiBaseUrl';
import { newArticlePage as editArticlePage } from '../../support/comonent-objects/articles/new-article-page';

import { ownArticle } from 'cypress/fixtures/articles';
import { user } from 'cypress/fixtures/user';

describe('NEW ARTICLE PAGE', () => {
  beforeEach(() => {
    cy.addTokenToLocalStorage();
    cy.intercept('GET', `${apiBaseUrl}articles/Lorem`, { article: ownArticle });
    cy.intercept('GET', `${apiBaseUrl}users`, { user });
    cy.visit('/edit-article/Lorem');
  });

  it('inputs should have valid class and have values', () => {
    editArticlePage.title
      .should('have.class', 'ng-valid')
      .and('contain.value', 'Lorem');

    editArticlePage.description
      .should('have.class', 'ng-valid')
      .and(
        'contain.value',
        'Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u'
      );

    editArticlePage.body
      .should('have.class', 'ng-valid')
      .and(
        'include.value',
        'Lorem ipsum dolor sit amet consectetur adip ex ea commodo consequ velit es u.'
      );

    editArticlePage.tagList
      .should('have.class', 'ng-valid')
      .and('contain.value', 'lorem');
  });

  it('should redirect to article page if updated successfully', () => {
    const editedArticle = { ...ownArticle, title: 'My new title' };
    cy.intercept('PUT', `${apiBaseUrl}articles/Lorem`, {
      article: editedArticle,
    });
    cy.intercept('GET', `${apiBaseUrl}articles/Lorem`, {
      article: editedArticle,
    });

    editArticlePage.title.clear().type('My new title');
    editArticlePage.publishButton.click();

    cy.location('pathname').should('contain', '/article');
  });
});

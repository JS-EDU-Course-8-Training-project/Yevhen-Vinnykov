import { apiBaseUrl } from 'cypress/support/apiBaseUrl';
import { userPage } from 'cypress/support/comonent-objects/user/user-page';

import { user } from 'cypress/fixtures/user';
import { articlesResponse } from 'cypress/fixtures/articles';

describe('USER PAGE', () => {
  beforeEach(() => {
    cy.intercept('GET', `${apiBaseUrl}users`, { user });
    cy.intercept('GET', `${apiBaseUrl}articles?**`, articlesResponse);
    cy.addTokenToLocalStorage();
    cy.visit(`/user/${user.username}`);
  });

  it('should have two tabs', () => {
    userPage.myArticlesTab.should('contain.text', 'My Articles');
    userPage.favoritedArticlesTab.should('contain.text', 'Favorited Articles');
  });

  it('tabs should switch when clicked', () => {
    userPage.favoritedArticlesTab
      .click()
      .should('have.class', 'mat-tab-label-active');

    userPage.myArticlesTab.click().should('have.class', 'mat-tab-label-active');
  });

  // it('if all articles have been loaded, articles-loaded div should be visible', () => {
  //   cy.scrollTo('bottom');
  //   userPage.articlesLoadedDiv.should('be.visible');
  // });

  describe('BANNER', () => {
    it('should have a user image, name and bio', () => {
      userPage.banner.should('be.visible');
      userPage.image.should('be.visible');
      userPage.username.should('be.visible');
      userPage.bio.should('be.visible');
    });

    it('should have a button that redirects to settings', () => {
      userPage.updateButton.click();

      cy.location('pathname').should('eq', '/settings');
    });
  });
});

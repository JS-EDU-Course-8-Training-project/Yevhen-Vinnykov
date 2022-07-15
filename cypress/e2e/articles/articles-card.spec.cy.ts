import { apiBaseUrl } from 'cypress/support/apiBaseUrl';
import { articleCard } from '../../support/comonent-objects/articles/article-card';

import {
  likedArticle,
  dislikedArticle,
  articlesResponse,
} from 'cypress/fixtures/articles';
import { tags } from 'cypress/fixtures/tags';

describe('ARTICLE CARD', () => {
  beforeEach(() => {
    cy.intercept('GET', `${apiBaseUrl}articles/**`, articlesResponse);
    cy.intercept('GET', `${apiBaseUrl}tags`, { tags });
    cy.visit('/');
  });

  describe('HEADER', () => {
    it('it should have an info div with user name, image and created date', () => {
      articleCard.authorImage.should('be.visible');
      articleCard.authorName.should('be.visible');
      articleCard.date.should('be.visible');
    });

    describe('HEADER > AUTHORIZED', () => {
      beforeEach(() => {
        cy.addTokenToLocalStorage();
        cy.visit('/');
      });

      it('should like an article', () => {
        cy.intercept('POST', `${apiBaseUrl}articles/Lorem/favorite`, {
          article: likedArticle,
        });

        articleCard.likeButton(0).click().should('contain', '1');
        articleCard.likeIcon.should('have.css', 'color', 'rgb(244, 67, 54)');
      });

      it('should dislike an article', () => {
        cy.intercept('DELETE', `${apiBaseUrl}articles/Lorem/favorite`, {
          article: dislikedArticle,
        });

        articleCard.likeButton(1).click().should('contain', '0');
        articleCard.likeIcon.should('have.css', 'color', 'rgba(0, 0, 0, 0.87)');
      });
    });

    describe('HEADER > UNAUTHORIZED', () => {
      it('click on like button should redirect to login page', () => {
        articleCard.likeButton(0).click();

        cy.location('pathname').should('contain', '/sign-in');
      });

      it('click on user image should redirect to login page', () => {
        articleCard.authorImage.click();

        cy.location('pathname').should('contain', '/sign-in');
      });

      it('click on user name should redirect to login page', () => {
        articleCard.authorName.click();

        cy.location('pathname').should('contain', '/sign-in');
      });
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

    it('should redirect to article page when read more is clicked', () => {
      cy.intercept('GET', `${apiBaseUrl}articles/Lorem`, {
        article: dislikedArticle,
      });

      articleCard.readMoreLink.click();

      cy.location('pathname').should('eq', '/article/Lorem');
    });
  });
});

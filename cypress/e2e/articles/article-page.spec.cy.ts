import { apiBaseUrl } from 'cypress/support/apiBaseUrl';
import { articlePage } from '../../support/comonent-objects/articles/article-page';

import { comments } from 'cypress/fixtures/comments';
import { user } from 'cypress/fixtures/user';
import {
  notOwnArticle,
  ownArticle,
  likedArticle,
  dislikedArticle,
  articleOfNotFollowedUser,
  articleOfFollowedUser,
} from 'cypress/fixtures/articles';

describe('ARTICLE PAGE', () => {
  beforeEach(() => {
    cy.addTokenToLocalStorage();

    cy.intercept('GET', `${apiBaseUrl}articles/Lorem`, {
      article: notOwnArticle,
    });
    cy.intercept('GET', `${apiBaseUrl}users`, { user });
    cy.intercept('GET', `${apiBaseUrl}articles/Lorem/comments`, { comments });

    cy.visit('/article/Lorem');
  });

  describe('BANNER', () => {
    it('should have a title', () => {
      articlePage.title.should('contain.text', 'Lorem');
    });

    it('should have a block with user image, user name and created date', () => {
      articlePage.authorImage.should('be.visible');
      articlePage.authorImage.should('be.visible');
      articlePage.date.should('be.visible');
    });

    describe('NOT OWN ARTICLE > ACTIONS', () => {
      it('should like an article', () => {
        cy.intercept('POST', `${apiBaseUrl}articles/Lorem/favorite`, {
          article: likedArticle,
        });

        articlePage.likeButton.click();
        articlePage.likeButton.should('include.text', 'Favorite Article (1)');
        articlePage.likeIcon.should('have.css', 'color', 'rgb(244, 67, 54)');
      });

      it('should dislike an article', () => {
        cy.intercept('GET', `${apiBaseUrl}articles/Lorem`, {
          article: likedArticle,
        });
        cy.visit('/article/Lorem');

        cy.intercept('DELETE', `${apiBaseUrl}articles/Lorem/favorite`, {
          article: dislikedArticle,
        });

        articlePage.likeButton.click();
        articlePage.likeButton.should('include.text', 'Favorite Article (0)');
        articlePage.likeIcon.should('have.css', 'color', 'rgb(255, 255, 255)');
      });

      it('should follow a user', () => {
        cy.intercept('GET', `${apiBaseUrl}articles/Lorem`, {
          article: articleOfNotFollowedUser,
        });
        cy.visit('/article/Lorem');

        const username = articleOfNotFollowedUser.author.username;
        cy.intercept('POST', `${apiBaseUrl}profiles/${username}/follow`, {
          profile: { following: true },
        });

        articlePage.followButton.click();
        articlePage.followButton.should('include.text', `Unfollow ${username}`);
      });

      it('should unfollow a user', () => {
        cy.intercept('GET', `${apiBaseUrl}articles/Lorem`, {
          article: articleOfFollowedUser,
        });
        cy.visit('/article/Lorem');

        const username = articleOfFollowedUser.author.username;
        cy.intercept('DELETE', `${apiBaseUrl}profiles/${username}/follow`, {
          profile: { following: false },
        });

        articlePage.followButton.click();
        articlePage.followButton.should('include.text', `Follow ${username}`);
      });
    });

    describe('OWN ARTICLE > ACTIONS', () => {
      beforeEach(() => {
        cy.intercept('GET', `${apiBaseUrl}articles/Lorem`, {
          article: ownArticle,
        });
        cy.visit('/article/Lorem');
      });

      it('should redirect to edit article page', () => {
        articlePage.editButton.should('contain', 'Edit').click();

        cy.location('pathname').should('contain', '/edit-article');
      });

      it('should delete an article and redirect to home page', () => {
        cy.intercept('DELETE', `${apiBaseUrl}articles/Lorem`, {});

        articlePage.deleteButton.should('contain', 'Delete').click();

        cy.location('pathname').should('eq', '/');
      });
    });
  });

  describe('BODY', () => {
    it('should have an article body and tags', () => {
      articlePage.body.should('be.visible');
      articlePage.tags.should('contain.text', 'lorem');
    });
  });

  describe('COMMENT FORM', () => {
    it('should have the comment form with a textarea and a button', () => {
      articlePage.commentForm.should('be.visible');
      articlePage.commentTextarea.should(
        'have.attr',
        'placeholder',
        'Write a comment...'
      );
      articlePage.commentPostButton.should('be.disabled');
    });

    it('should add a comment', () => {
      cy.intercept('POST', `${apiBaseUrl}articles/Lorem/comments`).as(
        'postComment'
      );

      articlePage.commentTextarea.type('This is my test comment');
      articlePage.commentPostButton.click();

      cy.wait('@postComment')
        .its('request.body.comment.body')
        .should('eq', 'This is my test comment');
    });

    it('should delete a comment', () => {
      cy.intercept('DELETE', `${apiBaseUrl}articles/Lorem/comments/**`, {
        response: {},
      }).as('deleteComment');

      articlePage.commentDeleteButton.click();

      cy.wait('@deleteComment').its('response.statusCode').should('eq', 200);
    });
  });
});

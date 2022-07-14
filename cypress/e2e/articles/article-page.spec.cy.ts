import { apiBaseUrl } from 'cypress/support/apiBaseUrl';
import { articlePage } from '../../support/comonent-objects/articles/article-page';

describe('ARTICLE PAGE', () => {
    beforeEach(() => {
        cy.addTokenToLocalStorage();

        cy.fixture('articles').then(res => {
            const article = res.articles[0];
            cy.intercept('GET', `${apiBaseUrl}articles/Lorem`, {article} ).as('getArticle');
        });

        cy.intercept('GET', `${apiBaseUrl}articles/Lorem/comments`, { comments: [] }).as('getComments');
        cy.intercept('GET', `${apiBaseUrl}users`, { fixture: 'user.json' }).as('getAuthUser');

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
            it('should like and dislike an article', () => {
                cy.intercept(
                    'POST',
                    `${apiBaseUrl}articles/Lorem/favorite`,
                    { article: { favorited: true, favoritesCount: 1 } }
                ).as('likeArticle');

                cy.intercept(
                    'DELETE',
                    `${apiBaseUrl}articles/Lorem/favorite`,
                    { article: { favorited: false, favoritesCount: 0 } }
                ).as('dislikeArticle');

                articlePage.likeButton.click();
                articlePage.likeButton.should('contain.text', ' favorite  Favorite Article (1) ');
                articlePage.likeIcon.should('have.css', 'color', 'rgb(244, 67, 54)');

                articlePage.likeButton.click();
                articlePage.likeButton.should('contain.text', ' favorite  Favorite Article (0) ');
                articlePage.likeIcon.should('have.css', 'color', 'rgb(255, 255, 255)');
            });

            it('should follow and unfollow a user', () => {
                cy.intercept(
                    'POST',
                    `${apiBaseUrl}profiles/Jane/follow`,
                    { profile: { following: true } }
                ).as('followProfile');

                cy.intercept(
                    'DELETE',
                    `${apiBaseUrl}profiles/Jane/follow`,
                    { profile: { following: false } }
                ).as('unfollowProfile');

                articlePage.followButton.click();
                articlePage.followButton.should('contain.text', ' Unfollow Jane ');

                articlePage.followButton.click();
                articlePage.followButton.should('contain.text', ' Follow Jane ');
            });
        });

        describe('OWN ARTICLE > ACTIONS', () => {
            beforeEach(() => {
                cy.fixture('articles').then(res => {
                    const article = res.articles[0];  // change the article's author's name  
                    article.author.username = 'John'; // so it matches the authorized user's name 

                    cy.intercept('GET', `${apiBaseUrl}articles/Lorem`, {article} ).as('getArticle');
                });
                cy.visit('/article/Lorem');
            });

            it('should redirect to edit article page', () => {
                articlePage.editButton.should('contain', 'Edit').click();
    
                cy.location('pathname').should('contain', '/edit-article');
            });
    
            it('should delete an article and redirect to home page', () => {
                cy.intercept('DELETE', `${apiBaseUrl}articles/Lorem`, {} ).as('deleteArticle');

                articlePage.deleteButton.should('contain', 'Delete').click();
    
                cy.location('pathname').should('eq', '/');
            });
        })
    });

    describe('BODY', () => {
        it('should have an article body and tags', () => {
            articlePage.body.should('be.visible');
            articlePage.tags.should('contain.text', 'lorem');
        });
    });

    describe('COMMENT FORM', () => {
        beforeEach(() => {
            cy.intercept('GET', `${apiBaseUrl}articles/Lorem/comments`, { fixture: 'comments.json' })
                .as('getComments');
        });

        it('should have the comment form with a textarea and a button', () => {
            articlePage.commentForm.should('be.visible');
            articlePage.commentTextarea.should('have.attr', 'placeholder', 'Write a comment...');
            articlePage.commentPostButton.should('be.disabled');
        });

        it('should add a comment', () => {
            cy.intercept('POST', `${apiBaseUrl}articles/Lorem/comments`).as('postComment');

            articlePage.commentTextarea.type('This is my test comment');
            articlePage.commentPostButton.click();

            cy.wait('@postComment').its('request.body.comment.body').should('eq', 'This is my test comment');
        });

        it('should delete a comment', () => {
            cy.intercept('DELETE', `${apiBaseUrl}articles/Lorem/comments/**`, {response: {}}).as('deleteComment');

            articlePage.commentDeleteButton.click();

            cy.wait('@deleteComment').its('response.statusCode').should('eq', 200);
        });
    });
});

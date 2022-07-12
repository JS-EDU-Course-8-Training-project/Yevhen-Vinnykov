import { articlePage } from '../../support/comonent-objects/articles/article-page';

describe('ARTICLE PAGE', () => {
    beforeEach(() => {
        cy.login();
        cy.createNotOwnArticle();
        cy.visit('/article/NotMyArticle');
    });

    describe('BANNER', () => {
        it('should have a title', () => {
            articlePage.title.should('contain.text', 'NotMyArticle');
        });

        it('should have a block with user image, user name and created date', () => {
            articlePage.authorImage.should('be.visible');
            articlePage.authorImage.should('be.visible');
            articlePage.date.should('be.visible');
        });

        describe('NOT OWN ARTICLE > ACTIONS', () => {
            it('should like and dislike an article', () => {
                articlePage.likeButton.click().should('contain.text', ' favorite  Favorite Article (1) ');
                articlePage.likeIcon.should('have.css', 'color', 'rgb(244, 67, 54)');

                articlePage.likeButton.click().should('contain.text', ' favorite  Favorite Article (0) ');
                articlePage.likeIcon.should('have.css', 'color', 'rgb(255, 255, 255)');
            });

            it('should follow and unfollow a user', () => {
                articlePage.followButton
                    .click()
                    .should('contain.text', ' Unfollow Jane ')
                    .click()
                    .should('contain.text', ' Follow Jane ');
            });
        });

        describe('OWN ARTICLE > ACTIONS', () => {
            beforeEach(() => {
                cy.createOwnArticle();
                cy.visit('/article/MyArticle');
            });

            it('should redirect to edit article page', () => {
                articlePage.editButton.should('contain', 'Edit').click();
    
                cy.location('pathname').should('contain', '/edit-article');
            });
    
            it('should delete an article and redirect to home page', () => {
                articlePage.deleteButton.should('contain', 'Delete').click();
    
                cy.location('pathname').should('eq', '/');
            });
        });

    });

    describe('BODY', () => {
        it('should have an article body and tags', () => {
            articlePage.body.should('be.visible');
            articlePage.tags.should('be.visible');
        });
    });

    describe('COMMENT FORM', () => {
        it('should have the comment form with a textarea', () => {
            articlePage.commentForm.should('be.visible');
            articlePage.commentTextarea.should('have.attr', 'placeholder', 'Write a comment...');
        });

        it('button should be disabled if the form is empty', () => {
            articlePage.commentPostButton.should('be.disabled');
        });

        it('should add a comment', () => {
            articlePage.commentTextarea.type('Test comment');
            articlePage.commentPostButton.click();

            articlePage.comment.should('contain.text', 'Test comment');
        });

        it('should delete a comment', () => {
            articlePage.commentDeleteButton.each((btn) => btn.click());
            articlePage.loadingSpinner.should('be.visible');
        });
    });
});

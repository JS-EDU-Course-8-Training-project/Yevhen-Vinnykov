describe('ARTICLE PAGE', () => {
    beforeEach(() => {
        cy.login();
        cy.createNotOwnArticle();
        cy.visit('/article/NotMyArticle');
    });

    describe('BANNER', () => {
        it('should have a title', () => {
            cy.get('[data-angular="article-title"]').should('contain.text', 'NotMyArticle');
        });

        it('should have a block with user image, user name and created date', () => {
            cy.get('[data-angular="banner-actions"]').as('bannerActions');

            cy.get('@bannerActions').find('img').should('be.visible');
            cy.get('@bannerActions').find('h3').should('be.visible');
            cy.get('@bannerActions').find('p').should('be.visible');
        });

        describe('NOT OWN ARTICLE > ACTIONS', () => {
            it('should like and dislike an article', () => {
                cy.get('[data-angular="test-like-btn"]').eq(0).as('likeButton');
                cy.get('[data-angular="likeIcon"]').as('likeIcon');

                cy.get('@likeButton')
                    .click()
                    .should('contain.text', ' favorite  Favorite Article (1) ');
                cy.get('@likeIcon').should('have.css', 'color', 'rgb(244, 67, 54)');

                cy.get('@likeButton')
                    .click()
                    .should('contain.text', ' favorite  Favorite Article (0) ');
                cy.get('@likeIcon').should('have.css', 'color', 'rgb(255, 255, 255)');
            });

            it('should follow and unfollow a user', () => {
                cy.get('[data-angular="test-follow-btn"]')
                    .eq(0)
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
                cy.get('[data-angular="test-edit-btn"]')
                    .should('contain', 'Edit')
                    .eq(0)
                    .click();
    
                cy.location('pathname').should('contain', '/edit-article');
            });
    
            it('should delete an article and redirect to home page', () => {
                cy.get('[data-angular="test-delete-btn"]')
                    .should('contain', 'Delete')
                    .eq(0)
                    .click();
    
                cy.location('pathname').should('eq', '/');
            });
        });

    });

    describe('BODY', () => {
        it('should have an article body', () => {
            cy.get('[data-angular="article-body"]')
                .find('p')
                .should('be.visible');
        });

        it('should have tags', () => {
            cy.get('[data-angular="tag"]').should('be.visible');
        });

        it('should article actions', () => {
            cy.get('[data-angular="article-actions-container"]').should('be.visible');
        });
    });

    describe('COMMENT FORM', () => {
        beforeEach(() => {
            cy.get('[data-angular="post-comment-btn"]').as('postCommentBtn')
        });
        it('should have the comment form with a textarea', () => {
            cy.get('[data-angular="comment-form"]').should('be.visible');
            cy.get('#body').and('have.attr', 'placeholder', 'Write a comment...');
        });

        it('button should be disabled if the form is empty', () => {
            cy.get('@postCommentBtn').should('be.disabled');
        });

        it('should add a comment', () => {
            cy.get('#body').type('Test comment');
            cy.get('@postCommentBtn').click();

            cy.get('[data-angular="comment"]').should('contain.text', 'Test comment');
        });

        it('should delete a comment', () => {
            cy.get('[data-angular="test-delete-icon"]').each((icon) => icon.click());
            cy.get('[data-angular="loading-spinner"]').should('be.visible');
        });
    });
});

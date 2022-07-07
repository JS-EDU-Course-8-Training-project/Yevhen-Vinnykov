describe('ARTICLE PAGE', () => {
    beforeEach(() => {
        cy.login();
        cy.visit('/article/Test');
    });

    describe('BANNER', () => {
        it('should have a title', () => {
            cy.get('[data-angular="article-title"]').should('contain.text', 'Test');
        });

        it('should have an block with user image, user name and created date', () => {
            cy.get('[data-angular="banner-actions"]').as('bannerActions');

            cy.get('@bannerActions').find('img').should('be.visible');
            cy.get('@bannerActions').find('h3').should('be.visible');
            cy.get('@bannerActions').find('p').should('be.visible');
        });

        it('should have a block with buttons', () => {
            cy.get('[data-angular="test-follow-btn"]').should('be.visible').and('contain', 'Follow');
            cy.get('[data-angular="test-like-btn"]').should('be.visible').and('contain', 'Favorite');
        });

        it('should like an article', () => {
            cy.intercept(
                'POST', 'http://localhost:3000/api/articles/**/favorite',
                { fixture: 'favoritedArticle.json' }
            ).as('unfavorite');

            cy.get('[data-angular="test-like-btn"]')
                .eq(0)
                .as('likeButton')
                .click()
                .should('contain.text', ' favorite  Favorite Article (1) ');

            cy.get('[data-angular="likeIcon"]')
                .should('have.css', 'color', 'rgb(244, 67, 54)');
        });

        // it('should dislike an article', () => {
        //     cy.intercept('GET', 'http://localhost:3000/api/articles/**', { fixture: 'favoritedArticle.json' });
        //     cy.intercept(
        //         'DELETE', 'http://localhost:3000/api/articles/**/favorite',
        //         { fixture: 'unfavoritedArticle.json' }
        //     ).as('unfavorite');

        //     cy.get('[data-angular="test-like-btn"]').eq(0).as('likeButton').click();


        //     cy.get('[data-angular="likeIcon"]')
        //         .should('have.css', 'color', 'rgb(255, 255, 255)');

        //     cy.get('@likeButton').should('contain.text', ' favorite  Favorite Article (0) ');
        // });

        //     it('should like and dislike the article', () => {
        //         cy.intercept(
        //             'POST', 'http://localhost:3000/api/articles/**/favorite',
        //             {fixture: 'favoritedArticle.json'}
        //           ).as('favorite');

        //           cy.intercept(
        //             'DELETE', 'http://localhost:3000/api/articles/**/favorite',
        //             {fixture: 'unfavoritedArticle.json'}
        //           ).as('unfavorite');

        //         cy.get('[data-angular="test-like-btn"]').eq(0).as('likeButton');

        //         cy.get('@likeButton')
        //         .click()
        //         .should('have.text', 'favorite Favorite Article (1)');

        //         cy.get('[data-angular="likeIcon"]')
        //         .as('likeIcon')
        //         .should('have.css', 'color', 'rgb(244, 67, 54)');

        //         cy.get('@likeButton')
        //         .click()
        //         .should('contain.text', '0');

        //         cy.get('@likeIcon')
        //         .should('have.css', 'color', 'rgb(255, 255, 255)');
        //     });
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
        it('should have the comment form', () => {
            cy.get('[data-angular="comment-form"]').should('be.visible');
        });

        it('should have a textarea', () => {
            cy.get('#body').and('have.attr', 'placeholder', 'Write a comment...');
        });

        it('button should be disabled if the form is empty', () => {
            cy.get('@postCommentBtn').should('be.disabled');
        });

        it('should add a comment', () => {
            cy.get('#body').type('Test comment');
            cy.get('@postCommentBtn').click();
            cy.get('[data-angular="comment"]')
                .should('be.visible')
                .and('contain.text', 'Test comment');
        });

        it('should delete a comment', () => {
            cy.get('[data-angular="test-delete-icon"]').each((icon) => icon.click());
        });
    });
});

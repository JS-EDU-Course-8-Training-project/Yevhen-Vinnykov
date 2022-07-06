describe('ARTICLE PAGE', () => {
    beforeEach(() => {
        cy.login();
        cy.visit('/article/Test');
    });

    describe('BANNER', () => {
        it('should have a title', () => {
            cy.get('mat-card-title').should('contain.text', 'Test');
        });

        it('should have an block with user image, user name and created date', () => {
            cy.get('.banner-actions > a > img').should('be.visible');
            cy.get('a > div > h3').should('be.visible');
            cy.get('a > div > p').should('be.visible');
        });

        it('should have an block with buttons', () => {
            cy.get('[data-angular="test-follow-btn"]').should('be.visible').and('contain', 'Follow');
            cy.get('[data-angular="test-like-btn"]').should('be.visible').and('contain', 'Favorite');
        });

        it('should like and dislike the article', () => {
            cy.intercept(
                'POST', 'http://localhost:3000/api/articles/**/favorite',
                {fixture: 'favoritedArticle.json'}
              ).as('favorite');
          
              cy.intercept(
                'DELETE', 'http://localhost:3000/api/articles/**/favorite',
                {fixture: 'unfavoritedArticle.json'}
              ).as('unfavorite');

            cy.get('[data-angular="test-like-btn"]').eq(0).as('likeButton');

            cy.get('@likeButton')
            .click()
            .should('contain.text', 'favorite Favorite Article (1)');

            cy.get('.mat-button-wrapper > .mat-icon')
            .as('likeIcon')
            .should('have.css', 'color', 'rgb(244, 67, 54)');

            
            cy.get('@likeButton')
            .click()
            .should('contain.text', '0');

            cy.get('@likeIcon')
            .should('have.css', 'color', 'rgb(255, 255, 255)');
        });
    });

    describe('BODY', () => {
        it('should have an article body', () => {
            cy.get('.article-body > p').should('be.visible');
        });

        it('should have tags', () => {
            cy.get('.mat-chip').should('be.visible');
        });

        it('should article actions', () => {
            cy.get('.article-actions-container').should('be.visible');
        });
    });


    describe('FORM', () => {
        it('should have the comment form', () => {
            cy.get('form').should('be.visible');
        });

        it('should have a textarea', () => {
            cy.get('#body').and('have.attr', 'placeholder', 'Write a comment...');
        });

        it('button should be disabled if the form is empty', () => {
            cy.get('.footer > button').and('be.disabled');
        });

        it('should add a comment', () => {
            cy.get('#body').type('Test comment');
            cy.get('.footer > button').click();
            cy.get('.comment').should('be.visible').and('contain.text', 'Test comment');
        });

        it('should delete a comment', () => {
            cy.get('mat-icon').each((icon) => icon.click());
        });
    });
});

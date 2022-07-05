describe('ARTICLE CARD', () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:3000/api/articles/?offset=0&limit=5', { fixture: "articles.json" })
            .as('getArticles');
        cy.intercept('GET', 'http://localhost:3000/api/tags', { fixture: "tags.json" })
            .as('getTags');
        cy.visit('/');
    });

    describe('HEADER', () => {
        it('it should have an info div with user name, image and created date', () => {
            const infoDiv = cy.get('app-article-list > mat-card > header > .info');

            infoDiv.get(':nth-child(1) > img').should('be.visible');    // img
            infoDiv.get('div > a').should('be.visible');                // name
            infoDiv.get('div > .text-secondary').should('be.visible');  // date
        });

        it('it should have a like button', () => {
            const header = cy.get('app-article-list > mat-card > header');
            header.get('button').should('be.visible');
        });

        it('user image should redirect to login page if unauthorized', () => {
            const infoDiv = cy.get('app-article-list > mat-card > header > .info');
            infoDiv.get(':nth-child(1) > img').eq(0).click();

            cy.location('pathname').should('contain', '/sign-in');
        });

        it('user name should redirect to login page if unauthorized', () => {
            cy.get('h3').contains('jane').click();
            cy.location('pathname').should('contain', '/sign-in');
        });
    });

    describe('BODY', () => {
        it('it should have an h2 with the article title', () => {
            cy.get('app-article-list > .mat-card > .card-content > :nth-child(1) > h2').should('be.visible');
        });

        it('it should have a paragraph with the article description', () => {
            cy.get('app-article-list > .mat-card > .card-content > :nth-child(1) > p').should('be.visible');
        });
    });

    describe('FOOTER', () => {
        it('it should have a footer with read more link and tags', () => {
            cy.get('a').contains('Read more...').and('have.attr', 'href');
            cy.get('.tags').should('contain.html', 'p');
        });

        it('it redirect to article page when read more is clicked', () => {
            cy.intercept('GET', 'http://localhost:3000/api/articles/**', {fixture: 'article.json'});
            cy.get('a').contains('Read more...').click();

            cy.location('pathname').should('contain', '/article');
        });
    });
});

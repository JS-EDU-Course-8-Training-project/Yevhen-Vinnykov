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
            cy.get('header > div').as('infoDiv');

            cy.get('@infoDiv').find(':nth-child(1) > img').should('be.visible');   // img
            cy.get('@infoDiv').find('div > a > h3').should('be.visible');          // name
            cy.get('@infoDiv').find('div > .text-secondary').should('be.visible'); // date
        });

        it('it should have a like button', () => {
            cy.get('mat-card > header > button').should('be.visible');
        });

        it('user image should redirect to login page if unauthorized', () => {
            cy.get(':nth-child(1) > img').eq(0).click();

            cy.location('pathname').should('contain', '/sign-in');
        });

        it('user name should redirect to login page if unauthorized', () => {
            cy.get('header').find('h3').eq(0).click();
            cy.location('pathname').should('contain', '/sign-in');
        });
    });

    describe('BODY', () => {
        it('it should have an h2 with the article title', () => {
            cy.get('mat-card').find('h2').should('be.visible');
        });

        it('it should have a paragraph with the article description', () => {
            cy.get('.card-content > :nth-child(1) > p').should('be.visible');
        });
    });

    describe('FOOTER', () => {
        it('it should have a footer with read more link and tags', () => {
            cy.get('a').contains('Read more...').and('have.attr', 'href');
            cy.get('.tags').find('.tag').should('be.visible');
        });

        it('it redirect to article page when read more is clicked', () => {
            cy.intercept('GET', 'http://localhost:3000/api/articles/**', {fixture: 'favoritedArticle.json'});
            cy.get('a').contains('Read more...').click();

            cy.location('pathname').should('contain', '/article');
        });
    });
});

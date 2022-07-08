describe('NEW ARTICLE PAGE', () => {
    beforeEach(() => {
        cy.login();
        cy.createOwnArticle();
        cy.visit('/edit-article/MyArticle');
    });

    beforeEach(() => {
        cy.get('[data-angular="publish-btn"]').as('publishBtn');
    });

    it('should have green left borders', () => {
        const formInputs = ['#title', '#description', '#body', '#tagList'];
        const [cssProp, cssValue] = ['border-left', '5px solid rgb(66, 169, 72)'];

        formInputs.forEach((input) => cy.get(input).should('have.css', cssProp, cssValue));
    });

    it('should have values in the inputs', () => {
       cy.get('#title').should('contain.value', 'MyArticle');
       cy.get('#description').should('contain.value', 'My test article');
       cy.get('#body').should('contain.value', 'My test article');
       cy.get('#tagList').should('contain.value', 'tag');
    });

    it('should redirect to article page if updated successfully', () => {
        cy.intercept('PUT', 'http://localhost:3000/api/articles/MyArticle', {fixture: 'unfavoritedArticle.json'});
        cy.intercept('GET', 'http://localhost:3000/api/articles/**', {fixture: 'unfavoritedArticle.json'});

        cy.get('#title').clear().type('Them and green firmament had');
       
        cy.get('[data-angular="publish-btn"]').click();
        cy.location('pathname').should('contain', '/article');
     });
});

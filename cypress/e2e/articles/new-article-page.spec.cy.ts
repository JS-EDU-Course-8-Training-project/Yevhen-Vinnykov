describe('NEW ARTICLE PAGE', () => {
    const formFilelds = ['#title', '#description', '#body', '#tagList'];

    beforeEach(() => {
        cy.login();
        cy.visit('/create-article');
    });

    describe('PUBLISH BUTTON', () => {
        it('should be disabled if the form is empty', () => {
            cy.get('button').should('be.disabled');
        });

        it('should be enabled if the form is valid', () => {
            formFilelds.forEach((f) => cy.get(f).type('test'));
            cy.get('button').should('be.enabled');
        });
    });

    describe('NEW ARTICLE FORM', () => {
        it('should have a required error span if the fields are touched and empty', () => {
            formFilelds.forEach((f) => cy.get(f).type('test').clear().blur());

            formFilelds.forEach((field, index) => {
                cy.get('.form-group > span')
                .eq(index)
                .should('be.visible')
                .and('contain', 'This field is required');
            });
        });

        it('should have green left borders if the inputs are valid', () => {
            const [cssProp, cssValue] = ['border-left', '5px solid rgb(66, 169, 72)'];
            formFilelds.forEach((f) => cy.get(f).type('test').blur().should('have.css', cssProp, cssValue));
        });

        it('should redirect to article page if the article has been created', () => {
            cy.intercept('POST', 'http://localhost:3000/api/articles', { fixture: 'unfavoritedArticle.json'});
            cy.intercept('GET', 'http://localhost:3000/api/articles/**', { fixture: 'unfavoritedArticle.json'});

            formFilelds.forEach((f) => cy.get(f).type('test'));
            cy.get('button').click();

            cy.location('pathname').should('contain', '/article');
        });
     });
});

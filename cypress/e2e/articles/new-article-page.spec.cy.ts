describe('NEW ARTICLE PAGE', () => {
    const formInputs = ['#title', '#description', '#body', '#tagList'];

    beforeEach(() => {
        cy.login();
        cy.visit('/create-article');
    });

    beforeEach(() => {
        cy.get('[data-angular="publish-btn"]').as('publishBtn');
    });

    describe('PUBLISH BUTTON', () => {
        it('should be disabled if the form is empty', () => {
            cy.get('@publishBtn').should('be.disabled');
        });

        it('should be enabled if the form is valid', () => {
            formInputs.forEach((input) => cy.get(input).type('test'));
            cy.get('@publishBtn').should('be.enabled');
        });
    });

    describe('NEW ARTICLE FORM', () => {
        it('should have a required error span if the fields are touched and empty', () => {
            formInputs.forEach((input) => cy.get(input).type('test').clear().blur());

            formInputs.forEach((input, index) => {
                cy.get('[angular-data="invalid-form-error"]')
                    .eq(index)
                    .should('contain.text', 'This field is required');
            });
        });

        it('should have green left borders if the inputs are valid', () => {
            const [cssProp, cssValue] = ['border-left', '5px solid rgb(66, 169, 72)'];
            formInputs.forEach((input) => cy.get(input).type('test').blur().should('have.css', cssProp, cssValue));
        });

        it('should redirect to article page if the article has been created', () => {
            cy.intercept('POST', 'http://localhost:3000/api/articles', { fixture: 'unfavoritedArticle.json' });
            cy.intercept('GET', 'http://localhost:3000/api/articles/**', { fixture: 'unfavoritedArticle.json' });

            formInputs.forEach((input) => cy.get(input).type('test'));
            cy.get('@publishBtn').click();

            cy.location('pathname').should('contain', '/article');
        });
    });
});

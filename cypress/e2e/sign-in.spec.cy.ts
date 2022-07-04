describe('SING IN PAGE', () => {
    beforeEach(() => {
        cy.visit('/sign-in');
    });

    describe('SIGN-IN BUTTON', () => {
        it('should be disabled if the form is empty', () => {
            cy.get('button').should('be.disabled');
        });

        it('should be disabled if the form is invalid', () => {
            cy.get('#email').type('invalid email');
            cy.get('#password').type('invld');
            cy.get('button').should('be.disabled');
        });

        it('should be enabled if the form is valid', () => {
            cy.get('#email').type('johndoe@email.com');
            cy.get('#password').type('JohnDoe1');
            cy.get('button').should('not.be.disabled');
        });
    });
    describe('SIGN-IN FORM', () => {
        it('should have a required error span if the fields are touched and empty', () => {
            cy.get('#email').type('johndoe@email.com').clear();
            cy.get('#password').type('JohnDoe1').clear().blur();
            cy.get('.form-group > :nth-child(4)')
                .should('be.visible')
                .and('contain', 'This field is required');
            cy.get('.form-group > :nth-child(6)')
                .should('be.visible')
                .and('contain', 'Password must be at least 6 characters long');
        });

        it('should have an invalid error span if the fields are touched and invalid', () => {
            cy.get('#email').type('invalid email');
            cy.get('#password').type('11111').blur();
            cy.get('.form-group > :nth-child(4)')
                .should('be.visible')
                .and('contain', 'Enter a valid email');
            cy.get('.form-group > :nth-child(6)')
                .should('be.visible')
                .and('contain', 'Password must be at least 6 characters long');
        });

        it('should have green left borders if the inputs are valid', () => {
            const [cssProp, cssValue] = ['border-left', '5px solid rgb(66, 169, 72)'];
            cy.get('#email')
                .type('johndoe@gmail.com')
                .blur()
                .should('have.css', cssProp, cssValue);

            cy.get('#password')
                .type('JohnDoe1')
                .blur()
                .should('have.css', cssProp, cssValue);
        });

        it('should redirect to home if the the credentials are valid', () => {
            cy.intercept('POST', 'http://localhost:3000/api/users/login', { fixture: 'user.json' })
                .as('signIn');
            cy.intercept('GET', 'http://localhost:3000/api/articles/feed/?offset=0&limit=5', { fixture: "articles.json" })
                .as('getFollowedArticles');
            cy.intercept('GET', 'http://localhost:3000/api/tags', { fixture: "tags.json" })
                .as('getTags');

            cy.get('#email').type('johndoe@gmail.com');
            cy.get('#password').type('JohnDoe1');
            cy.get('button').click();

            cy.get('header').find('a').should('be.visible').and('contain', 'jane');
            cy.get('mat-card')
                .should('be.visible')
                .and('contain', 'Lorem ipsum dolor sit amet consectetur adipisicing elit');

            cy.get('div.mat-tab-labels').should('contain', 'Your Feed');
            cy.get('div.tags').should('contain', 'Popular Tags');
            cy.get('mat-card.mat-focus-indicator.card-container')
                .should('be.visible')
                .and('contain', 'Them and green firmament had, were may, first us bring dry');

            cy.get('div.finished')
                .should('be.visible')
                .and('contain', 'No more articles for now...');
        });
    });
})

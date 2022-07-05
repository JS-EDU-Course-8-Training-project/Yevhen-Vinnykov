describe('HEADER', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should have title', () => {
        cy.get('header > a:first')
            .should('be.visible')
            .and('contain.text', 'Real World')
            .and('have.attr', 'href', '/');
    });

    describe('WHEN THE USER IS NOT AUTHORIZED', () => {
        it('should have home, sign-in and sign-up buttons', () => {
            cy.get('app-navbar')
                .find('a')
                .eq(0)
                .should('be.visible')
                .and('have.class', 'selected')
                .and('contain.text', ' Home ')
                .and('have.attr', 'href', '/');

            cy.get('app-navbar')
                .find('a')
                .eq(1)
                .should('be.visible')
                .and('contain.text', ' Sign in ')
                .and('have.attr', 'href', '/sign-in');

            cy.get('app-navbar')
                .find('a')
                .eq(2)
                .should('be.visible')
                .and('contain.text', ' Sign up ')
                .and('have.attr', 'href', '/sign-up');
        });

        it('links should redirect when clicked and add selected class', () => {
            const signInButton = cy.get('app-navbar').find('a').eq(1);
            signInButton.click();
            signInButton.should('have.class', 'selected');
            cy.location('pathname').should('contain', '/sign-in');

            const signUpButton = cy.get('app-navbar').find('a').eq(2);
            signUpButton.click();
            signUpButton.should('have.class', 'selected');
            cy.location('pathname').should('contain', '/sign-up');

            const homeButton = cy.get('app-navbar').find('a').eq(0);
            homeButton.click();
            homeButton.should('have.class', 'selected');
            cy.location('pathname').should('contain', '/');
        });

        it('should not have new article, settings and user buttons', () => {
            cy.get('[routerlink="/create-article"]').should('not.exist');
            cy.get('[routerlink="/settings"]').should('not.exist');
            cy.get('app-navbar-user').should('not.exist');
        });
    });


    describe('WHEN THE USER IS AUTHORIZED', () => {
        beforeEach(() => {
            cy.login();
            cy.visit('/');
        });

        it('should have home, new article, settings and user buttons', () => {
            cy.get('app-navbar')
                .find('a')
                .eq(0)
                .should('be.visible')
                .and('have.class', 'selected')
                .and('contain.text', ' Home ')
                .and('have.attr', 'href', '/');

            cy.get('app-navbar')
                .find('a')
                .eq(1)
                .should('be.visible')
                .and('contain.text', ' New Article ')
                .and('have.attr', 'href', '/create-article');

            cy.get('app-navbar')
                .find('a')
                .eq(2)
                .should('be.visible')
                .and('contain.text', ' Settings ')
                .and('have.attr', 'href', '/settings');

            cy.get('app-navbar-user')
                .should('be.visible')
                .find('a').should('have.attr', 'href', '/user/John');
        });

        it('links should redirect when clicked and add selected class', () => {
            const newArticleButton = cy.get('app-navbar').find('a').eq(1);
            newArticleButton.click();
            newArticleButton.should('have.class', 'selected');
            cy.location('pathname').should('contain', '/create-article');

            const settingsButton = cy.get('app-navbar').find('a').eq(2);
            settingsButton.click();
            settingsButton.should('have.class', 'selected');
            cy.location('pathname').should('contain', '/settings');

            const userButton =  cy.get('app-navbar-user').find('a');
            userButton.click();
            userButton.should('have.class', 'selected');
            cy.location('pathname').should('contain', '/user/John');

            const homeButton = cy.get('app-navbar').find('a').eq(0);
            homeButton.click();
            homeButton.should('have.class', 'selected');
            cy.location('pathname').should('contain', '/');
        });

        it('should not have sign-in and sign-up buttons', () => {
            cy.get('[routerlink="/sign-in"]').should('not.exist');
            cy.get('[routerlink="/sign-up"]').should('not.exist');
        });
    });
});
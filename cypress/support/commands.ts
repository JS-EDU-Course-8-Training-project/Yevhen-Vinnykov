declare namespace Cypress {
    interface Chainable<Subject> {
        login(): Chainable<Subject>
    }

    interface Chainable<Subject> {
        createOwnArticle(): Chainable<Subject>
    }

    interface Chainable<Subject> {
        createNotOwnArticle(): Chainable<Subject>
    }

    interface Chainable<Subject> {
        getByTestAttr(selector: string): Chainable<Element>;

        findByTestAttr(selector: string): Chainable<Element>;
    }
}

Cypress.Commands.add('getByTestAttr', selector => {
    cy.get(`[data-test=${selector}]`);
});


Cypress.Commands.add(
    'findByTestAttr',
    { prevSubject: 'element' },
    ($element: JQuery<HTMLElement>, selector: string) => {
        cy.wrap($element).find(`[data-test=${selector}]`);
    });
    

Cypress.Commands.add('login', () => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/users/login',
        failOnStatusCode: false,
        body: {
            user: {
                email: 'john@example.com',
                password: 'Password1'
            }
        }
    }).then(response => {
        if (response.status === 404) {
            // if the user doesn't exist, seed the db
            cy.request({
                method: 'POST',
                url: 'http://localhost:3000/api/users/signup',
                body: {
                    user: {
                        username: 'John',
                        email: 'john@example.com',
                        password: 'Password1'
                    }
                }
            }).then(response => {
                window.localStorage.setItem('authorized', 'true');
                window.localStorage.setItem('token', response.body.user.token);
            });
            return;
        }
        window.localStorage.setItem('authorized', 'true');
        window.localStorage.setItem('token', response.body.user.token);
    });
});

Cypress.Commands.add('createOwnArticle', () => {
    const token = window.localStorage.getItem('token');
    if (!token) return console.log('Authorize first');

    // if the article already exists, the response will have an error, but the test won't fail
    cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/articles',
        headers: {
            'x-access-token': token,
        },
        failOnStatusCode: false,
        body: {
            article: {
                title: 'MyArticle',
                description: 'My test article',
                body: 'My test article',
                tagList: ['tag']
            }
        }
    });
});

Cypress.Commands.add('createNotOwnArticle', () => {
    let token: string;

    // sign in or sign up as another user to get their token
    cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/users/login',
        failOnStatusCode: false,
        body: {
            user: {
                email: 'jane@example.com',
                password: 'Password1'
            }
        }
    }).then(response => {
        if (response.status === 404) {
            // if the user doesn't exist, seed the db
            cy.request({
                method: 'POST',
                url: 'http://localhost:3000/api/users/signup',
                body: {
                    user: {
                        username: 'Jane',
                        email: 'jane@example.com',
                        password: 'Password1'
                    }
                }
            }).then(response => token = response.body.user.token);
        } else {
            token = response.body.user.token;
        }

        // if the article already exists, the response will have an error, but the test won't fail
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/articles',
            headers: {
                'x-access-token': token,
            },
            failOnStatusCode: false,
            body: {
                article: {
                    title: 'NotMyArticle',
                    description: 'Not my test article',
                    body: 'Not my test article',
                    tagList: ['tag']
                }
            }
        });
    });
});
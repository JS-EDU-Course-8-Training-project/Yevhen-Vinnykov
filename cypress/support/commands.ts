declare namespace Cypress {
    interface Chainable<Subject> {
        login(): Chainable<Subject>
    }
}

Cypress.Commands.add('login', () => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/users/login',
        body: {
            user: {
                email: 'john@example.com',
                password: 'Password1'
            }
        }
    }).then(response => {
        window.localStorage.setItem('authorized', 'true');
        window.localStorage.setItem('token', response.body.user.token);
    });
});

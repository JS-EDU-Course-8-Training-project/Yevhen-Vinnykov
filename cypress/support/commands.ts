declare namespace Cypress {
    interface Chainable<Subject> {
        login(): Chainable<Subject>
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
    window.localStorage.setItem('authorized', 'true');
    window.localStorage.setItem('token', 'token');
});
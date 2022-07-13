import { TestAttributes } from "src/app/shared/tests/TestAttributes";

class SignUpPage {
    get title() { 
        return cy.getByTestAttr(TestAttributes.FormTitle);
    }

    get signInLink() {
        return cy.getByTestAttr(TestAttributes.SignInLink);
    }

    get username() {
        return cy.getByTestAttr(TestAttributes.UsernameInput);
    }

    get email() {
        return cy.getByTestAttr(TestAttributes.EmailInput);
    }

    get password() {
        return cy.getByTestAttr(TestAttributes.PasswordInput);
    }

    get signUpButton() {
        return cy.getByTestAttr(TestAttributes.SignUpBtn);
    }

    get formError() {
        return cy.getByTestAttr(TestAttributes.FormError);
    }
}

export const signUpPage = new SignUpPage();
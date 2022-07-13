import { TestAttributes } from "src/app/shared/tests/TestAttributes";

class SignInPage {
    get title() { 
        return cy.getByTestAttr(TestAttributes.FormTitle);
    }

    get signUpLink() {
        return cy.getByTestAttr(TestAttributes.SignUpLink);
    }

    get email(){
        return cy.getByTestAttr(TestAttributes.EmailInput);
    }

    get password(){
        return cy.getByTestAttr(TestAttributes.PasswordInput);
    }

    get signInButton(){
        return cy.getByTestAttr(TestAttributes.SignInBtn);
    }

    get formError(){
        return cy.getByTestAttr(TestAttributes.FormError);
    }
}

export const signInPage = new SignInPage();
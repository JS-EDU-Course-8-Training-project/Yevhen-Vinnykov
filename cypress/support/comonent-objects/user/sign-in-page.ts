import { TestAttributes } from "src/app/shared/tests/TestAttributes.old";

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

    signIn(email: string, password: string){
        this.email.clear().type(email);
        this.password.clear().type(password);
        this.signInButton.click();
    }
}

export const signInPage = new SignInPage();
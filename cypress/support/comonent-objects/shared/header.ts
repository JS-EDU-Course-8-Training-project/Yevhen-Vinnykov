import { TestAttributes } from "src/app/shared/tests/TestAttributes.old";
import { ComponentObject } from "../component-object";

class Header extends ComponentObject {
    get title(){
        return cy.getByTestAttr(TestAttributes.AppTitle);
    }
    
    get homeLink() {
        return cy.getByTestAttr(TestAttributes.NavHomeLink);
    }

    get newArticleLink() {
        return cy.getByTestAttr(TestAttributes.NavNewArticleLink);
    }

    get settingsLink() {
        return cy.getByTestAttr(TestAttributes.NavSettingsLink);
    }

    get userPageLink() {
        return cy.getByTestAttr(TestAttributes.NavUserPageLink);
    }

    get signInLink() {
        return cy.getByTestAttr(TestAttributes.NavSignInLink);
    }

    get signUpLink() {
        return cy.getByTestAttr(TestAttributes.NavSignUpLink);
    }
}

export const header = new Header(TestAttributes.Header);

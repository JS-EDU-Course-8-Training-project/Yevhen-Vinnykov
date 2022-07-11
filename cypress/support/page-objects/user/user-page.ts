import { TestAttributes } from "src/app/shared/tests/TestAttributes";

class UserPage {
    get username() {
        return cy.getByTestAttr(TestAttributes.UserPageUsername);
    }

    get bio() {
        return cy.getByTestAttr(TestAttributes.UserPageBio);
    }

    get image() {
        return cy.getByTestAttr(TestAttributes.UserPageImg);
    }

    get myArticlesTab() {
        // return cy.getByTestAttr(TestAttributes.MyArticlesTab);           // TODO: data test attributes are not attached for some reason
        return cy.get('[role="tab"]').eq(0);
    }

    get favoritedArticlesTab() {
        // return cy.getByTestAttr(TestAttributes.FavoritedArticlesTab);
        return cy.get('[role="tab"]').eq(1);
    }

    get updateButton() {
        return cy.getByTestAttr(TestAttributes.UserPageUpdateBtn);
    }
}

export const userPage = new UserPage();
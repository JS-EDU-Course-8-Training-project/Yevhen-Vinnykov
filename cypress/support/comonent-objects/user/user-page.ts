import { TestAttributes } from 'src/app/shared/tests/TestAttributes';

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
    return cy.get('[role="tab"]').eq(0);
  }

  get favoritedArticlesTab() {
    return cy.get('[role="tab"]').eq(1);
  }

  get updateButton() {
    return cy.getByTestAttr(TestAttributes.UserPageUpdateBtn);
  }

  get banner() {
    return cy.getByTestAttr('user-page-banner');
  }

  get articlesLoadedDiv() {
    return cy.getByTestAttr('all-articles-loaded');
  }
}

export const userPage = new UserPage();

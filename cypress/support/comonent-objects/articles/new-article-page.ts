import { TestAttributes } from 'src/app/shared/tests/TestAttributes';

class NewArticlePage {
  get title() {
    return cy.getByTestAttr(TestAttributes.ArticleTitleInput);
  }

  get description() {
    return cy.getByTestAttr(TestAttributes.ArticleDescriptionInput);
  }

  get body() {
    return cy.getByTestAttr(TestAttributes.ArticleBodyInput);
  }

  get tagList() {
    return cy.getByTestAttr(TestAttributes.ArticleTagListInput);
  }

  get formError() {
    return cy.getByTestAttr(TestAttributes.FormError);
  }

  get publishButton() {
    return cy.getByTestAttr(TestAttributes.PublishBtn);
  }
}

export const newArticlePage = new NewArticlePage();

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

  get image() {
    return cy.getByTestAttr(TestAttributes.ArticleImageInput);
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

  get addTagInputBtn() {
    return cy.getByTestAttr(TestAttributes.AddTagInputBtn);
  }

  deleteTagInputBtn(index?: number) {
    return typeof index === 'number'
      ? cy.getByTestAttr(TestAttributes.DeleteTagInputBtn).eq(index)
      : cy.getByTestAttr(TestAttributes.DeleteTagInputBtn);
  }
}

export const newArticlePage = new NewArticlePage();

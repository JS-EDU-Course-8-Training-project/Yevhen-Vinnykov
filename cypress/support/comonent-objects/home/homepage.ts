import { TestAttributes } from 'src/app/shared/tests/TestAttributes';

class HomePage {
  get loadingSpinner() {
    return cy.getByTestAttr(TestAttributes.LoadingSpinner);
  }

  get banner() {
    return cy.getByTestAttr(TestAttributes.HomePageBanner);
  }

  get globalFeedTab() {
    return cy.get('[role=tab]').contains('Global Feed');
  }

  get yourFeedTab() {
    return cy.get('[role=tab]').contains('Your Feed');
  }

  get taggedArticlesTab() {
    return cy.get('[role=tab]').contains('#');
  }

  get articleCard() {
    return cy.getByTestAttr(TestAttributes.ArticleCard).eq(0);
  }

  get allTags() {
    return cy.getByTestAttr(TestAttributes.TagsContainer);
  }

  get tag() {
    return cy.getByTestAttr(TestAttributes.Tag);
  }

  get globalFeed() {
    return cy.getByTestAttr(TestAttributes.GlobalFeed);
  }

  get yourFeed() {
    return cy.getByTestAttr(TestAttributes.YourFeed);
  }

  get taggedArticles() {
    return cy.getByTestAttr(TestAttributes.TaggedArticles);
  }
}

export const homepage = new HomePage();

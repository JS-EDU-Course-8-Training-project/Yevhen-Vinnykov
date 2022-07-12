import { TestAttributes } from 'src/app/shared/tests/TestAttributes.old';

class HomePage {
    get loadingSpinner() {
        return cy.getByTestAttr(TestAttributes.LoadingSpinner);
    }

    get globalFeedTab() {
        // return cy.getByTestAttr(TestAttributes.GlobalFeedTab);    // TODO: data test attributes are not attached for some reason
        return cy.contains('Global Feed');
    }

    get yourFeedTab() {
        // return cy.getByTestAttr(TestAttributes.YourFeedTab);
        return cy.contains('Your Feed');

    }

    get taggedArticlesTab() {
        // return cy.getByTestAttr(TestAttributes.TaggedArticlesTab);
        return cy.contains('#');

    }

    get articleCard() {
        return cy.getByTestAttr(TestAttributes.ArticleCard).eq(0);
    }

    get likeButton() {
        return cy.getByTestAttr(TestAttributes.ArticleCardLikeBtn).eq(0);
    }

    get likeIcon() {
        return cy.getByTestAttr(TestAttributes.ArticleCardLikeIcon).eq(0);
    }

    get allTags(){
        return cy.getByTestAttr(TestAttributes.TagsContainer);
    }

    get tag(){
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
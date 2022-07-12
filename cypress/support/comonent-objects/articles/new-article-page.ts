import { TestAttributes } from "src/app/shared/tests/TestAttributes.old";

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

    fillInputs() {
        this.title.type('test');
        this.description.type('test');
        this.body.type('test');
        this.tagList.type('test');
    }

    clearInputs() {
        this.title.clear();
        this.description.clear();
        this.body.clear();
        this.tagList.clear();
    }
}

export const newArticlePage = new NewArticlePage();
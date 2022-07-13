import { TestAttributes } from "src/app/shared/tests/TestAttributes";

class ArticlePage {
    get title(){
        return cy.getByTestAttr(TestAttributes.ArticleTitle);
    }

    get authorImage() {
        return cy.getByTestAttr(TestAttributes.ArticlePageAuthorImg);
    }

    get authorName() {
        return cy.getByTestAttr(TestAttributes.ArticlePageAuthorName);
    }

    get date() {
        return cy.getByTestAttr(TestAttributes.ArticlePageDate);
    }

    get likeButton() {
        return cy.getByTestAttr(TestAttributes.ArticleLikeBtn).eq(0);
    }

    get likeIcon() {
        return cy.getByTestAttr(TestAttributes.ArticleLikeIcon).eq(0);
    }

    get followButton() {
        return cy.getByTestAttr(TestAttributes.ArticleFollowBtn).eq(0);
    }

    get editButton() {
        return cy.getByTestAttr(TestAttributes.ArticleEditBtn).eq(0);
    }

    get deleteButton() {
        return cy.getByTestAttr(TestAttributes.ArticleDeleteBtn).eq(0);
    }

    get body(){
        return cy.getByTestAttr(TestAttributes.ArticlePageBody);
    }

    get tags(){
        return cy.getByTestAttr(TestAttributes.Tag);
    }

    get comment(){
        return cy.getByTestAttr(TestAttributes.Comment).eq(0);
    }

    get commentPostButton(){
        return cy.getByTestAttr(TestAttributes.CommentPostBtn);
    }

    get commentForm(){
        return cy.getByTestAttr(TestAttributes.CommentForm);
    }

    get commentTextarea(){
        return cy.getByTestAttr(TestAttributes.CommentTextarea);
    }

    get commentDeleteButton(){
        return cy.getByTestAttr(TestAttributes.CommentDeleteBtn).eq(0);
    }

    get loadingSpinner() {
        return cy.getByTestAttr(TestAttributes.LoadingSpinner);
    }
}

export const articlePage = new ArticlePage();

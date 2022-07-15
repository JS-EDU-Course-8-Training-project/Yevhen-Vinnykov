import { TestAttributes } from "src/app/shared/tests/TestAttributes";
import { ComponentObject } from "../component-object";

class ArticleCard extends ComponentObject {
    get title(){
        return cy.getByTestAttr(TestAttributes.ArticleCardTitle);
    }

    get authorImage(){
        return cy.getByTestAttr(TestAttributes.ArticleCardAuthorImg).eq(0);
    }

    get authorName(){
        return cy.getByTestAttr(TestAttributes.ArticleCardAuthorName).eq(0);
    }

    get date(){
        return cy.getByTestAttr(TestAttributes.ArticleCardDate);
    }

    get description(){
        return cy.getByTestAttr(TestAttributes.ArticleCardDescription);
    }

    get footer() {
        return cy.getByTestAttr(TestAttributes.ArticleCardFooter);
    }

    get likeIcon() {
        return cy.getByTestAttr(TestAttributes.ArticleCardLikeIcon).eq(0);
    }

    get articleTags(){
        return cy.getByTestAttr(TestAttributes.ArticleCardTags);
    }

    get readMoreLink(){
        return cy.getByTestAttr(TestAttributes.ArticleCardReadMoreLink).eq(0);
    }

    likeButton(index: number){
        return cy.getByTestAttr(TestAttributes.ArticleCardLikeBtn).eq(index);
    }
}

export const articleCard = new ArticleCard(TestAttributes.ArticleCard);

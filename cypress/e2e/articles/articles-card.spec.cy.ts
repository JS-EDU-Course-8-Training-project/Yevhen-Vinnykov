import { articleCard } from '../../support/comonent-objects/articles/article-card';

describe('ARTICLE CARD', () => {
    const baseUrl = 'http://localhost:3000/api/';

    beforeEach(() => {
        cy.intercept('GET', `${baseUrl}articles/?offset=0&limit=5`, { fixture: "articles.json" })
            .as('getArticles');

        cy.intercept('GET', `${baseUrl}tags`, { fixture: "tags.json" })
            .as('getTags');

        cy.visit('/');
    });

    describe('HEADER', () => {
        it('it should have an info div with user name, image and created date', () => {
            articleCard.authorImage.should('be.visible');
            articleCard.authorName.should('be.visible');
            articleCard.date.should('be.visible');
        });

        describe('HEADER > AUTHORIZED', () => {
            beforeEach(() => {
                cy.intercept(
                    'GET',
                    `${baseUrl}articles/feed/?offset=0&limit=5`,
                    { fixture: "articles.json" }
                ).as('getFeed');

                cy.intercept(
                    'POST',
                    `${baseUrl}articles/Lorem/favorite`,
                    { article: { favorited: true, favoritesCount: 1 } }
                ).as('likeArticle');

                cy.intercept(
                    'DELETE',
                    `${baseUrl}articles/Lorem/favorite`,
                    { article: { favorited: false, favoritesCount: 0 } }
                ).as('dislikeArticle');

                cy.login();
                cy.visit('/');
            });

            it('should like and dislike an article', () => {
                // like
                articleCard.likeButton.click().should('contain', '1');
                articleCard.likeIcon.should('have.css', 'color', 'rgb(244, 67, 54)');

                // dislike
                articleCard.likeButton.click().should('contain', '0');
                articleCard.likeIcon.should('have.css', 'color', 'rgba(0, 0, 0, 0.87)');
            });
        });

        describe('HEADER > UNAUTHORIZED', () => {
            it('click on like button should redirect to login page', () => {
                articleCard.likeButton.click();

                cy.location('pathname').should('contain', '/sign-in');
            });

            it('click on user image should redirect to login page', () => {
                articleCard.authorImage.click();

                cy.location('pathname').should('contain', '/sign-in');
            });

            it('click on user name should redirect to login page', () => {
                articleCard.authorName.click();

                cy.location('pathname').should('contain', '/sign-in');
            });
        });
    });

    describe('BODY', () => {
        it('it should have an h2 with the article title', () => {
            articleCard.title.should('be.visible');
        });

        it('it should have a paragraph with the article description', () => {
            articleCard.description.should('be.visible');
        });
    });

    describe('FOOTER', () => {
        it('it should have a footer with read more link and tags', () => {
            articleCard.readMoreLink.should('have.attr', 'href');
            articleCard.articleTags.should('be.visible');
        });

        it('should redirect to article page when read more is clicked', () => {
            cy.fixture('articles').then(res => {
                const article = res.articles[0];
                cy.intercept('GET', `${baseUrl}articles/**`, { article });
            });

            articleCard.readMoreLink.click();

            cy.location('pathname').should('eq', '/article/Lorem');
        });
    });
});

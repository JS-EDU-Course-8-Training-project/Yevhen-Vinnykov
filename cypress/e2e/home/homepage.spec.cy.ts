import { apiBaseUrl } from 'cypress/support/apiBaseUrl';
import { homepage } from '../../support/comonent-objects/home/homepage';

describe('HOME PAGE', () => {
    beforeEach(() => {
        cy.intercept('GET', `${apiBaseUrl}tags`, { fixture: "tags.json" })
            .as('getTags');

        cy.intercept('GET', `${apiBaseUrl}articles/**`, { fixture: "articles.json" })
            .as('getArticles');

        cy.visit('/');
    });

    it('home page should load correctly', () => {
        homepage.loadingSpinner.should('be.visible');

        homepage.banner.should('contain', 'Lorem ipsum dolor sit amet consectetur adipisicing elit');

        homepage.globalFeedTab.should('contain.text', 'Global Feed');

        homepage.allTags.should('contain.text', 'Popular Tags');

        homepage.loadingSpinner.should('not.exist');

        cy.scrollTo('bottom');

        cy.getByTestAttr('all-articles-loaded').should('contain.text', 'No more articles for now...');
    });

    it('should redirect to article page once an article card is clicked', () => {
        cy.fixture('articles').then(res => {
            const article = res.articles[0];
            cy.intercept('GET', `${apiBaseUrl}articles/**`, { article }).as('getArticle');
        });

        cy.intercept('GET', `${apiBaseUrl}articles/**/comments`, { fixture: "comments.json" })
            .as('getComments');

        homepage.articleCard.click();

        cy.location('pathname').should('contain', '/article/');
    });

    it('should toggle tagged articles tab', () => {
        cy.intercept('GET', `${apiBaseUrl}articles?tag=lorem&limit=5&offset=0`, { fixture: "articles.json" })
            .as('getTaggedArticles');

        homepage.allTags.contains('lorem').click();

        homepage.taggedArticlesTab.should('contain', '#lorem');
        homepage.globalFeedTab.click();
        homepage.taggedArticlesTab.should('not.exist');
    });

    it('your feed tab should not exist when the user is not authorized', () => {
        homepage.yourFeedTab.should('not.exist');
        homepage.yourFeed.should('not.exist');
    });

    describe('AUTHORIZED', () => {
        beforeEach(() => {
            cy.intercept('GET', `${apiBaseUrl}users`, { fixture: "user.json" })
                .as('getAuthUser');

            cy.intercept('GET', `${apiBaseUrl}articles/feed/**`, { fixture: "articles.json" })
                .as('getFeed');

            cy.addTokenToLocalStorage();
            cy.visit('/');
        });

        it('your feed tab should exist', () => {
            homepage.yourFeedTab.should('contain.text', 'Your Feed');
            homepage.yourFeed.should('be.visible');
        });
    });
});


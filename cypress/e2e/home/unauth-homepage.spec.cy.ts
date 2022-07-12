import { homepage } from '../../support/comonent-objects/home/homepage';

describe('ANUTHORIZED HOME PAGE', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/api/articles/?offset=0&limit=5', { fixture: "articles.json" })
      .as('getArticles');
    cy.intercept('GET', 'http://localhost:3000/api/tags', { fixture: "tags.json" })
      .as('getTags');

    cy.visit('/');
  });

  it('should load the home page correctly', () => {
    homepage.loadingSpinner.should('be.visible');

    cy.getByTestAttr('home-page-banner')
      .should('contain.text', 'Lorem ipsum dolor sit amet consectetur adipisicing elit');

    homepage.globalFeedTab.should('contain.text', 'Global Feed');
    homepage.yourFeedTab.should('not.exist');

    homepage.allTags.should('contain.text', 'Popular Tags');
    homepage.globalFeed.should('be.visible');

    cy.getByTestAttr('all-articles-loaded').should('contain.text', 'No more articles for now...');

    homepage.loadingSpinner.should('not.exist');
  });

  it('should redirect to article page once the article card is clicked', () => {
    cy.intercept('GET', 'http://localhost:3000/api/articles/**', { fixture: "unfavoritedArticle.json" })
      .as('getArticleBySlug');
    cy.intercept('GET', 'http://localhost:3000/api/articles/**/comments', { fixture: "comments.json" })
      .as('getComments');

    homepage.articleCard.click();

    cy.location('pathname').should('contain', '/article/');
  });

  it('should toggle tagged articles tab', () => {
    cy.intercept('GET', 'http://localhost:3000/api/articles?tag=lorem&limit=5&offset=0', { fixture: "articles.json" })
      .as('getArticlesBySlug');

    homepage.tag.eq(0).click();

    homepage.taggedArticlesTab.should('contain.text', '#lorem');
    homepage.globalFeedTab.click();
    homepage.taggedArticlesTab.should('not.exist');
  });

  it('should redirect to sign in page if the user tries to like an article', () => {
    homepage.likeButton.eq(0).click();

    cy.location('pathname').should('contain', '/sign-in');
  });
})

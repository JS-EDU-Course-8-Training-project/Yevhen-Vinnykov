import { homepage } from '../../support/comonent-objects/home/homepage';

describe('AUTHORIZED HOME PAGE', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('GET', 'http://localhost:3000/api/articles/feed/?offset=0&limit=5', { fixture: "articles.json" })
      .as('getFollowedArticles');
    cy.intercept('GET', 'http://localhost:3000/api/tags', { fixture: "tags.json" })
      .as('getTags');

    cy.visit('/');
  });

  it('should load the home page correctly', () => {
   homepage.loadingSpinner.should('be.visible');

   cy.getByTestAttr('home-page-banner')
      .should('contain', 'Lorem ipsum dolor sit amet consectetur adipisicing elit');

    homepage.globalFeedTab.should('contain.text', 'Global Feed');
    homepage.yourFeedTab.should('contain.text', 'Your Feed');

    homepage.allTags.should('contain.text', 'Popular Tags');
    homepage.yourFeed.should('be.visible');

    cy.getByTestAttr('all-articles-loaded').should('contain.text', 'No more articles for now...');

    homepage.loadingSpinner.should('not.exist');
  });

  it('should redirect to article page once an article card is clicked', () => {
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

    homepage.allTags.contains('lorem').click();

    homepage.taggedArticlesTab.should('contain', '#lorem');
    homepage.yourFeedTab.click();
    homepage.taggedArticlesTab.should('not.exist');
  });

  it('should like and dislike an article', () => {
    cy.intercept(
      'POST', 'http://localhost:3000/api/articles/**/favorite',
      { fixture: 'favoritedArticle.json' }
    ).as('favorite');

    cy.intercept(
      'DELETE', 'http://localhost:3000/api/articles/**/favorite',
      { fixture: 'unfavoritedArticle.json' }
    ).as('unfavorite');

    // like
    homepage.likeButton.click().should('contain', '1');
    homepage.likeIcon.should('have.css', 'color', 'rgb(244, 67, 54)');

    // dislike
    homepage.likeButton.click().should('contain', '0');
    homepage.likeIcon.should('have.css', 'color', 'rgba(0, 0, 0, 0.87)');
  });
});


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
    cy.get('[data-angular="loading-spinner"]').should('be.visible');

    cy.get('[data-angular="home-banner"]')
      .should('contain', 'Lorem ipsum dolor sit amet consectetur adipisicing elit');

    cy.get('[role="tab"]').should('contain', 'Your Feed').and('contain', 'Global Feed');
    cy.get('[data-angular="tags"]').should('contain', 'Popular Tags');
    cy.get('[data-angular="your-feed"]').should('be.visible');

    cy.get('.finished').should('contain.text', 'No more articles for now...');

    cy.get('[data-angular="loading-spinner"]').should('not.exist');
  });

  it('should redirect to article page once an article card is clicked', () => {
    cy.intercept('GET', 'http://localhost:3000/api/articles/**', { fixture: "unfavoritedArticle.json" })
      .as('getArticleBySlug');
    cy.intercept('GET', 'http://localhost:3000/api/articles/**/comments', { fixture: "comments.json" })
      .as('getComments');

    cy.get('[data-angular="article-card"]').eq(0).click();

    cy.location('pathname').should('contain', '/article/');
  });

  it('should toggle tagged articles tab', () => {
    cy.intercept('GET', 'http://localhost:3000/api/articles?tag=lorem&limit=5&offset=0', { fixture: "articles.json" })
      .as('getArticlesBySlug');

    cy.get('[data-angular="test-tag-div"]').eq(0).click();

    cy.get('[role="tab"]').as('tabs');
    cy.get('@tabs').should('contain', '#lorem');
    cy.get('@tabs').contains('Your Feed').click();
    cy.get('@tabs').should('not.contain', '#lorem');
  });

  it('should like and dislike an article', () => {
    cy.get('[data-angular="article-card-like-btn"]').eq(0).as('likeButton');
    cy.get('[data-angular="article-card-like-icon"]').eq(0).as('likeIcon');

    cy.intercept(
      'POST', 'http://localhost:3000/api/articles/**/favorite',
      { fixture: 'favoritedArticle.json' }
    ).as('favorite');

    cy.intercept(
      'DELETE', 'http://localhost:3000/api/articles/**/favorite',
      { fixture: 'unfavoritedArticle.json' }
    ).as('unfavorite');

    // like
    cy.get('@likeButton').click().should('contain', '1');
    cy.get('@likeIcon').should('have.css', 'color', 'rgb(244, 67, 54)');

    // dislike
    cy.get('@likeButton').click().should('contain', '0');
    cy.get('@likeIcon').should('have.css', 'color', 'rgba(0, 0, 0, 0.87)');
  });
});


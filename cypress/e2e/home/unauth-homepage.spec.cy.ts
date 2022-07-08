describe('ANUTHORIZED HOME PAGE', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/api/articles/?offset=0&limit=5', { fixture: "articles.json" })
      .as('getArticles');
    cy.intercept('GET', 'http://localhost:3000/api/tags', { fixture: "tags.json" })
      .as('getTags');

    cy.visit('/');
  });

  it('should load the home page correctly', () => {
    cy.get('[data-angular="loading-spinner"]').should('be.visible');

    cy.get('[data-angular="home-banner"]')
      .should('contain.text', 'Lorem ipsum dolor sit amet consectetur adipisicing elit');

    cy.get('[role="tab"]').should('contain', 'Global Feed');
    cy.get('[data-angular="tags"]').should('contain', 'Popular Tags');
    cy.get('[data-angular="global-feed"]').should('be.visible');

    cy.get('.finished').should('contain.text', 'No more articles for now...');

    cy.get('[data-angular="loading-spinner"]').should('not.exist');
  });

  it('should redirect to article page once the article card is clicked', () => {
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
    cy.get('@tabs').contains('Global Feed').click();
    cy.get('@tabs').should('not.contain', '#lorem');
  });

  it('should redirect to sign in page if the user tries to like an article', () => {
    cy.get('[data-angular="article-card-like-btn"]').eq(0).click();

    cy.location('pathname').should('contain', '/sign-in');
    cy.get('.selected').should('contain', 'Sign in');
  });
})

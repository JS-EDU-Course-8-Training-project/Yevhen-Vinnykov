describe('ANUTHORIZED HOME PAGE', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/api/articles/?offset=0&limit=5', { fixture: "articles.json" })
      .as('getArticles');
    cy.intercept('GET', 'http://localhost:3000/api/tags', { fixture: "tags.json" })
      .as('getTags');

    cy.visit('/');
  });

  it('should load the home page correctly', () => {
    cy.get('.home-banner')
      .should('be.visible')
      .and('contain', 'Lorem ipsum dolor sit amet consectetur adipisicing elit');

    cy.get('div.mat-tab-labels').should('contain', 'Global Feed');
    cy.get('div.tags').should('contain', 'Popular Tags');
    cy.get('app-global-feed').should('be.visible');

    cy.get('div.finished')
      .should('be.visible')
      .and('contain', 'No more articles for now...');
  });

  it('should redirect to article page once the article card is clicked', () => {
    cy.intercept('GET', 'http://localhost:3000/api/articles/**', { fixture: "article.json" })
      .as('getArticleBySlug');
    cy.intercept('GET', 'http://localhost:3000/api/articles/**/comments', { fixture: "comments.json" })
      .as('getComments');

    cy.get('mat-card.card-container').eq(0).click();

    cy.location('pathname').should('contain', '/article/');
  });

  it('should toggle tagged articles tab', () => {
    cy.intercept('GET', 'http://localhost:3000/api/articles?tag=lorem&limit=5&offset=0', { fixture: "articles.json" })
      .as('getArticlesBySlug');

    cy.get('.tag-item').eq(0).click();

    const tabs = cy.get('div.mat-tab-labels');
    tabs.should('contain', '#lorem');
    tabs.find('div:first').click();
    tabs.should('not.contain', '#lorem');
  });

  it('should redirect to sign in page if the user tries to like an article', () => {
    const likeButton = cy.get('.mat-card > header > button').eq(0);
    likeButton.click();

    cy.location('pathname').should('contain', '/sign-in');
    cy.get('.selected').should('contain', 'Sign in');
  });
})

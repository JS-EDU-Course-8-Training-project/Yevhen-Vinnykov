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
    cy.get('.home-banner')
      .should('be.visible')
      .and('contain', 'Lorem ipsum dolor sit amet consectetur adipisicing elit');

    cy.get('div.mat-tab-labels').should('contain', 'Your Feed').and('contain', 'Global Feed');
    cy.get('div.tags').should('contain', 'Popular Tags');
    cy.get('app-your-feed').should('be.visible');

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

  it('should like and dislike an article', () => {
    const likeButton = cy.get('.mat-card > header > button').eq(0);
    cy.intercept(
      'POST', 'http://localhost:3000/api/articles/**/favorite',
      { article: { favoritesCount: 9, favorited: true } }
    ).as('favorite');

    cy.intercept(
      'DELETE', 'http://localhost:3000/api/articles/**/favorite',
      { article: { favoritesCount: 8, favorited: false } }
    ).as('unfavorite');
    
    // not liked
    cy.get('span.mat-button-wrapper').should('contain','8');
    cy.get('span.mat-button-wrapper > .mat-icon').eq(0).should('have.css', 'color', 'rgba(0, 0, 0, 0.87)');
    
    // like
    likeButton.click();
    cy.get('span.mat-button-wrapper').should('contain','9');
    cy.get('span.mat-button-wrapper > .mat-icon').eq(0).should('have.css', 'color', 'rgb(244, 67, 54)');

    // dislike
    likeButton.click();
    cy.get('span.mat-button-wrapper').should('contain','8');
    cy.get('span.mat-button-wrapper > .mat-icon').eq(0).should('have.css', 'color', 'rgba(0, 0, 0, 0.87)');
  });
});


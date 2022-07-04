describe('ANUTHORIZED HOME PAGE', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/api/articles/?offset=0&limit=5', { fixture: "articles.json" })
      .as('getArticles');
    cy.intercept('GET', 'http://localhost:3000/api/tags', { fixture: "tags.json" })
      .as('getTags');
    cy.visit('/');
  });

  it('should load the home page correctly', () => {
    cy.get('header').should('be.visible').and('contain', 'Real World');
    cy.get('header').find('a').should('be.visible');
    cy.get('mat-card')
      .should('be.visible')
      .and('contain', 'Lorem ipsum dolor sit amet consectetur adipisicing elit');

    cy.get('div.mat-tab-labels').should('contain', 'Global Feed');
    cy.get('div.tags').should('contain', 'Popular Tags');
    cy.get('mat-card.mat-focus-indicator.card-container')
      .should('be.visible')
      .and('contain', 'Them and green firmament had, were may, first us bring dry');

    cy.get('div.finished')
      .should('be.visible')
      .and('contain', 'No more articles for now...');
  });

  it('should redirect to article page once the article card is clicked', () => {
    cy.intercept('GET', 'http://localhost:3000/api/articles/**', { fixture: "article.json" })
      .as('getArticleBySlug');
    cy.intercept('GET', 'http://localhost:3000/api/articles/**/comments', { fixture: "comments.json" })
      .as('getComments');

    const articleCard = cy.contains('Them and green firmament had, were may, first us bring dry');
    articleCard.click();

    cy.get('mat-card')
      .should('be.visible')
      .and('contain', 'Them and green firmament had');

    cy.get('div.article-body-container').should('be.visible');
    cy.get('div.article-actions-container').should('be.visible');
    cy.get('app-comments').should('be.visible').and('contain', 'This is my comment');
  });

  it('should toggle tagged articles tab', () => {
    cy.intercept('GET', 'http://localhost:3000/api/articles?tag=lorem&limit=5&offset=0', { fixture: "articles.json" })
      .as('getArticlesBySlug');

    const tag = cy.get('div.tags').find('div.tag-item:first').should('contain', 'lorem');
    tag.click();

    const tabs = cy.get('div.mat-tab-labels');
    tabs.should('contain', '#lorem');
    tabs.find('div:first').click();
    tabs.should('not.contain', '#lorem');
  });

  it('should redirect to sign in page if the user tries to like an article', () => {
    const likeButton = cy.get(':nth-child(1) > app-article-list.ng-star-inserted > .mat-card > header > .mat-focus-indicator');
    likeButton.click();

    cy.get('.form-group').should('be.visible').and('contain', 'Sign In');
    cy.get('.selected').should('contain', 'Sign in');
  });
})

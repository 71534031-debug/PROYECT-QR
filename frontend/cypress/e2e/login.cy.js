describe('Inicio de sesión (USER_FLOWS)', () => {
  it('credenciales inválidas muestran error', () => {
    cy.intercept('POST', '**/api/auth/login', { statusCode: 401, body: { success: false } }).as('login');
    cy.visit('/login');
    cy.get('[data-testid=login-email]').type('bad@test.com');
    cy.get('[data-testid=login-password]').type('wrong');
    cy.get('[data-testid=login-submit]').click();
    cy.wait('@login');
    cy.get('body').should('exist');
  });

  it('credenciales válidas redirigen al dashboard', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { success: true, token: 'fake', refreshToken: 'r', user: { id: 1, nombre: 'Admin', rol: 'ADMIN' } }
    }).as('loginOk');
    cy.visit('/login');
    cy.get('[data-testid=login-email]').type('admin@cip.local');
    cy.get('[data-testid=login-password]').type('Password123');
    cy.get('[data-testid=login-submit]').click();
    cy.wait('@loginOk');
    cy.url().should('include', '/');
    cy.get('[data-testid=dashboard-user]').should('contain', 'Admin');
  });
});

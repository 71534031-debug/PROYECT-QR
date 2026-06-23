describe('Plantillas - Creación con imagen', () => {
  it('Crea una plantilla con nombre e imagen de fondo', () => {
    const tag = Date.now();
    const nombrePlantilla = `E2E Plantilla ${tag}`;

    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { success: true, token: 'fake', refreshToken: 'r', user: { id: 1, nombre: 'Admin', rol: 'ADMIN' } }
    }).as('loginOk');

    cy.intercept('GET', '**/api/plantillas', (req) => {
      req.reply({ statusCode: 200, body: { success: true, data: [] } });
    }).as('getPlantillas');

    cy.intercept('POST', '**/api/plantillas', (req) => {
      expect(req.body).to.have.property('nombre', nombrePlantilla);
      req.reply({ statusCode: 201, body: { success: true, data: { id: 999, nombre: nombrePlantilla } } });
    }).as('createPlantilla');

    cy.intercept('POST', '**/api/plantillas/*/imagen', (req) => {
      expect(req.headers).to.have.property('content-type');
      expect(req.headers['content-type']).to.include('multipart/form-data');
      req.reply({ statusCode: 200, body: { success: true, url: 'uploads/images/test.png' } });
    }).as('uploadImage');

    cy.visit('/login');
    cy.get('[data-testid=login-email]').type('admin@cip.local');
    cy.get('[data-testid=login-password]').type('Password123');
    cy.get('[data-testid=login-submit]').click();
    cy.wait('@loginOk');
    cy.url().should('include', '/');

    cy.visit('/plantillas');
    cy.wait('@getPlantillas');

    cy.get('input#nombre').clear().type(nombrePlantilla);

    const testImg = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0x40, 0x00,
      0x00, 0x00, 0x00, 0xFF, 0xFF, 0x07, 0x80, 0x00, 0x01, 0xE3, 0xC0, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    cy.get('input[type=file]').selectFile({ contents: testImg, fileName: 'test.png', mimeType: 'image/png' }, { force: true });

    cy.get('button').contains('Crear Plantilla').click();
    cy.wait('@createPlantilla');
    cy.wait('@uploadImage');

    cy.get('.alert-success').should('not.exist');
  });
});

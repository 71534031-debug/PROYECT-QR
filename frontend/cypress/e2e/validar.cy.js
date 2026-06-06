describe('Validación pública', () => {
  it('código inválido muestra inválido', () => {
    cy.intercept('GET', '**/api/validacion?*', { statusCode: 404, body: { valido: false, message: 'No encontrado' } }).as(
      'val'
    );
    cy.visit('/validar?c=no-existe');
    cy.wait('@val');
    cy.get('[data-testid=validar-estado]').should('contain', 'Inválido');
  });

  it('código válido muestra válido', () => {
    cy.intercept('GET', '**/api/validacion?*', {
      statusCode: 200,
      body: { valido: true, data: { nombre: 'Juan Pérez', actividad: 'Curso', fecha: '2026-01-01' } }
    }).as('valOk');
    cy.visit('/validar?c=uuid-falso');
    cy.wait('@valOk');
    cy.get('[data-testid=validar-estado]').should('contain', 'Válido');
  });
});

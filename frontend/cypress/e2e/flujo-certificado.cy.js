describe('Flujo actividad → participante → plantilla → certificado', () => {
  it('admin completa el flujo con API real', () => {
    const tag = Date.now();
    const nombreActividad = `E2E Actividad ${tag}`;
    const doc = String(10000000 + (tag % 89999999)).slice(0, 8);
    const actividadId = 1;
    let createdParticipante = null;
    const plantillaId = 1;

    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { success: true, token: 'fake', refreshToken: 'r', user: { id: 1, nombre: 'Admin', rol: 'ADMIN' } }
    }).as('loginOk');

    cy.intercept('GET', '**/api/configuracion', { statusCode: 200, body: { data: {} } }).as('getConfig');
    cy.intercept('PUT', '**/api/configuracion', { statusCode: 200, body: { success: true } }).as('saveConfig');

    let createdActividad = null;
    cy.intercept('GET', '**/api/actividades', (req) => {
      req.reply({ statusCode: 200, body: { data: createdActividad ? [createdActividad] : [] } });
    }).as('getActividades');
    cy.intercept('POST', '**/api/actividades', (req) => {
      const actividad = { id: actividadId, nombre: nombreActividad, fecha_inicio: '2026-06-01', fecha_fin: '2026-06-05', responsable: 'Responsable E2E', estado: 'Activa' };
      createdActividad = actividad;
      req.reply({ statusCode: 201, body: { success: true, data: actividad } });
    }).as('createActividad');

    cy.intercept('GET', '**/api/participantes*', (req) => {
      const actividad = createdActividad || { id: actividadId, nombre: nombreActividad };
      req.reply({ statusCode: 200, body: { data: createdParticipante ? [createdParticipante] : [], actividades: [actividad] } });
    }).as('getParticipantes');
    cy.intercept('POST', '**/api/participantes', (req) => {
      const participante = { id: 1, nombres: 'Nombre', apellidos: 'Apellido', numero_documento: doc, email: `e2e.${tag}@example.com`, actividad_id: actividadId };
      createdParticipante = participante;
      req.reply({ statusCode: 201, body: { success: true, data: participante } });
    }).as('createParticipante');
    cy.intercept('POST', '**/api/participantes/*/validar-apto', { statusCode: 200, body: { success: true } }).as('validarApto');

    let createdPlantilla = null;
    cy.intercept('GET', '**/api/plantillas', (req) => {
      req.reply({ statusCode: 200, body: { data: createdPlantilla ? [createdPlantilla] : [] } });
    }).as('getPlantillas');
    cy.intercept('POST', '**/api/plantillas', (req) => {
      const plantilla = { id: plantillaId, nombre: nombrePlantilla };
      createdPlantilla = plantilla;
      req.reply({ statusCode: 201, body: { success: true, data: plantilla } });
    }).as('createPlantilla');

    cy.intercept('GET', '**/api/certificados', (req) => {
      const actividad = createdActividad || { id: actividadId, nombre: nombreActividad };
      const plantilla = { id: plantillaId, nombre: nombrePlantilla };
      req.reply({ statusCode: 200, body: { data: [], actividades: [actividad], plantillas: [plantilla] } });
    }).as('getCertificados');
    cy.intercept('POST', '**/api/certificados/generar', { statusCode: 200, body: { success: true, generados: 1 } }).as('generarCert');

    cy.visit('/login');
    cy.get('[data-testid=login-email]').type('admin@cip.local');
    cy.get('[data-testid=login-password]').type('Password123');
    cy.get('[data-testid=login-submit]').click();
    cy.wait('@loginOk');
    cy.url().should('include', '/');

    cy.visit('/configuracion');
    cy.wait('@getConfig');
    cy.get('[data-testid=config-nombre-institucion]').clear().type(`Institucion E2E ${tag}`);
    cy.get('[data-testid=config-cargo-autoridad]').clear().type('Director');
    cy.get('[data-testid=config-nombre-autoridad]').clear().type('Autoridad E2E');
    cy.get('[data-testid=config-submit]').click();
    cy.wait('@saveConfig');
    cy.get('[data-testid=config-msg]').should('contain', 'Guardado');

    cy.visit('/actividades');
    cy.wait('@getActividades');
    cy.get('[data-testid=actividad-nombre]').clear().type(nombreActividad);
    cy.get('[data-testid=actividad-fecha-inicio]').clear().type('2026-06-01');
    cy.get('[data-testid=actividad-fecha-fin]').clear().type('2026-06-05');
    cy.get('[data-testid=actividad-responsable]').clear().type('Responsable E2E');
    cy.get('[data-testid=actividad-submit]').click();
    cy.wait('@createActividad');
    cy.get('[data-testid=actividades-list]', { timeout: 10000 }).should('contain', nombreActividad);

    cy.visit('/participantes');
    cy.get('[data-testid=participantes-actividad]', { timeout: 15000 }).select(nombreActividad);
    cy.wait('@getParticipantes');
    cy.get('[data-testid=participante-nombres]').clear().type('Nombre');
    cy.get('[data-testid=participante-apellidos]').clear().type('Apellido');
    cy.get('[data-testid=participante-numero-doc]').clear().type(doc);
    cy.get('[data-testid=participante-email]').clear().type(`e2e.${tag}@example.com`);
    cy.get('[data-testid=participante-submit]').click();
    cy.wait('@createParticipante');
    cy.get('[data-testid=participantes-list]', { timeout: 10000 }).should('contain', 'Nombre');
    cy.get('[data-testid^=participante-apto-]').first().click();
    cy.wait('@validarApto');

    const nombrePlantilla = `Plantilla E2E ${tag}`;
    cy.visit('/plantillas');
    cy.wait('@getPlantillas');
    cy.get('[data-testid=plantilla-nombre]').clear().type(nombrePlantilla);
    cy.get('[data-testid=plantilla-form] button[type=submit]').click();
    cy.wait('@createPlantilla');

    cy.visit('/certificados');
    cy.wait('@getCertificados');
    cy.wait('@getPlantillas');
    cy.get('[data-testid=cert-actividad]', { timeout: 15000 }).select(nombreActividad);
    cy.wait(300);
    cy.get('[data-testid=cert-plantilla]').select(nombrePlantilla);
    cy.get('[data-testid=cert-generar-submit]').click();
    cy.wait('@generarCert');
    cy.get('[data-testid=cert-msg]').should('contain', 'Generados');
  });
});
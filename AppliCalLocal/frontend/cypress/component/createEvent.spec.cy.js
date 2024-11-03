export const createEvent = () => {
    it('ouvrir modal -> remplir champs -> sauvegarde -> constater', () => {
      cy.get('.fc-header-toolbar').should('exist'); 
  
      cy.get('.fc .fc-daygrid-day-number').contains('19').click(); 
  
      cy.get('input[name="title"]').clear().type('Nouveau Titre');
      cy.get('textarea[name="description"]').clear().type('Nouvelle Description');
      
      cy.get('button').contains('Shooting en situation').click(); 
      cy.get('div').contains('Shooting en situation').click(); 
  
      cy.get('button').contains('Sélectionner un décor').click();
      cy.get('div').contains('Racing').click(); 
  
      cy.get('input[type="checkbox"]').first().check(); 
  
      cy.get('button').contains('Sélectionner une adresse').click();
      cy.get('div').contains('Studio La rochelle').click(); 

      cy.get('input[value="chauffeur"]').check(); 
  
      cy.get('button').contains('Sauvegarder').click(); 
      cy.get('.fc-event').contains('Nouveau Titre').should('exist');
    });
  };
  
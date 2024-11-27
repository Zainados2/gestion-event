
export const checkPresta = () => {

    it('devrait ouvrir le menu et naviguer vers la page des prestataires', () => {
        
        cy.get('button').contains('Prestataire').click();
    
        cy.url().should('include', '/prestataire');
        cy.contains('Liste des Prestataires').should('exist');

        cy.get('.bg-white').should('have.length.greaterThan', 0); 

        cy.get('.bg-white').first().find('button').contains('Voir les détails').click();

        cy.url().should('match', /\/prestataire\/\d+$/);

        cy.get('select').first().select('Juillet');
    });
}

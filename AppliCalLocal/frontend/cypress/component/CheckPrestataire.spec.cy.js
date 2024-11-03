// cypress/component/CheckPrestataire.spec.cy.js

export const checkPresta = () => {
    // Votre code de test ici

    it('devrait ouvrir le menu et naviguer vers la page des prestataires', () => {
        
        // Cliquer sur le lien "Prestataire"
        cy.get('button').contains('Prestataire').click();
    
        // Vérifier que la page des prestataires est affichée
        cy.url().should('include', '/prestataire');
        cy.contains('Liste des Prestataires').should('exist');

        // Vérifiez que les prestataires sont affichés
        cy.get('.bg-white').should('have.length.greaterThan', 0); // Assurez-vous que des prestataires sont affichés

        // Cliquer sur le bouton "Voir les détails" du premier prestataire
        cy.get('.bg-white').first().find('button').contains('Voir les détails').click();

        // Vérifiez la redirection vers la page de détails du prestataire
        cy.url().should('match', /\/prestataire\/\d+$/);

        cy.get('select').first().select('Juillet');
    });
}

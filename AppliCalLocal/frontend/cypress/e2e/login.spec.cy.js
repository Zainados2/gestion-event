// cypress/e2e/login.spec.cy.js

import { createEvent } from '../component/createEvent.spec.cy';
import { checkPresta } from '../component/CheckPrestataire.spec.cy';

describe('Test de la page de connexion et des événements', () => {
  beforeEach(() => {
    // Connexion avec des identifiants valides avant chaque test
    cy.visit('http://165.232.115.209:3000/');
    cy.get('input[name="username"]').type('gerant');
    cy.get('input[name="password"]').type('azerty619');
    cy.get('form').submit();

    // Assurez-vous que la redirection vers la page du calendrier est effectuée
    cy.url().should('include', '/calendar');
  });

   createEvent();
   

  //  checkPresta();
});

const sequelize = require('../models/db'); // Importe ton instance Sequelize
const Address = require('../models/modelsAdresses'); // Importe le modèle Address

describe('Tests de base et de sécurité pour les adresses', () => {

  // Avant tous les tests, synchroniser les modèles
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Recrée la base de données pour avoir un état propre
  });

  // Après tous les tests, nettoyer la connexion à la base de données
  afterAll(async () => {
    await sequelize.close(); // Ferme la connexion à la base de données
  });

  // Test initial de la connexion à la base de données
  test('Se connecter à la base de données avec Sequelize', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  // Test de création d'une adresse
  test('Créer une adresse avec name: "123 Main St", location: "City", type: "studio"', async () => {
    const name = '123 Main St';
    const location = 'City';
    const type = 'studio'; // Utilisation de la valeur correcte de l'énumération

    // Créer l'adresse
    const newAddress = await Address.create({ name, location, type });

    // Vérifier que l'adresse a été créée avec les bonnes informations
    expect(newAddress).toBeDefined();
    expect(newAddress.name).toBe(name);
    expect(newAddress.location).toBe(location);
    expect(newAddress.type).toBe(type);
  });

  // Test d'injection SQL lors de la création d'une adresse
  test('Tentative d\'injection SQL lors de la création d\'une adresse', async () => {
    const name = '123 Main St; DROP TABLE addresses; --'; // Devrait échouer à cause de la validation
    const location = 'City';
    const type = 'studio'; // Utilisation d'une valeur valide pour type

    // Essayer de créer l'adresse
    let errorOccurred = false;
    try {
      await Address.create({ name, location, type });
    } catch (error) {
      errorOccurred = true;
      expect(error.message).toMatch(/Validation error/); // Vérifier les erreurs de validation
    }

    // L'adresse ne doit pas être créée
    expect(errorOccurred).toBe(true);

    // Vérifier que la table 'addresses' existe encore
    const addressesTableExists = await Address.count();
    expect(addressesTableExists).toBeGreaterThan(0); // La table 'addresses' doit toujours exister
  });

  // Test de recherche d'une adresse avec un mauvais ID
  test('Recherche d\'une adresse avec un mauvais ID', async () => {
    const wrongId = 9999; // Un ID qui n'existe probablement pas

    const address = await Address.findByPk(wrongId);

    expect(address).toBeNull(); // L'adresse ne doit pas exister
  });

  // Test de suppression d'une adresse avec un mauvais ID
  test('Suppression d\'une adresse avec un mauvais ID', async () => {
    const wrongId = 9999; // Un ID qui n'existe probablement pas

    try {
      const deleteResult = await Address.destroy({ where: { id: wrongId } });
      expect(deleteResult).toBe(0); // Rien ne doit être supprimé
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  });

  test('Tentative de création d\'adresse avec un type invalide', async () => {
    const name = '456 Elm St';
    const location = 'Town';
    const type = 'invalid'; // Valeur non autorisée
  
    let errorOccurred = false;
    try {
      await Address.create({ name, location, type });
    } catch (error) {
      errorOccurred = true;
      expect(error.errors[0].message).toBe('Validation isIn on type failed');
    }
  
    expect(errorOccurred).toBe(true);
  });
  
  

});

const sequelize = require('../models/db');
const Address = require('../models/modelsAdresses'); 

describe('Tests de base et de sécurité pour les adresses', () => {

  beforeAll(async () => {
    await sequelize.sync({ force: true }); 
  });

  afterAll(async () => {
    await sequelize.close(); 
  });

  test('Se connecter à la base de données avec Sequelize', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  test('Créer une adresse avec name: "123 Main St", location: "City", type: "studio"', async () => {
    const name = '123 Main St';
    const location = 'City';
    const type = 'studio'; 

    const newAddress = await Address.create({ name, location, type });

    expect(newAddress).toBeDefined();
    expect(newAddress.name).toBe(name);
    expect(newAddress.location).toBe(location);
    expect(newAddress.type).toBe(type);
  });

  test('Tentative d\'injection SQL lors de la création d\'une adresse', async () => {
    const name = '123 Main St; DROP TABLE addresses; --'; 
    const location = 'City';
    const type = 'studio'; 

    let errorOccurred = false;
    try {
      await Address.create({ name, location, type });
    } catch (error) {
      errorOccurred = true;
      expect(error.message).toMatch(/Validation error/); 
    }

    expect(errorOccurred).toBe(true);

    const addressesTableExists = await Address.count();
    expect(addressesTableExists).toBeGreaterThan(0); 
  });

  test('Recherche d\'une adresse avec un mauvais ID', async () => {
    const wrongId = 9999; 

    const address = await Address.findByPk(wrongId);

    expect(address).toBeNull(); 
  });

  test('Suppression d\'une adresse avec un mauvais ID', async () => {
    const wrongId = 9999; 

    try {
      const deleteResult = await Address.destroy({ where: { id: wrongId } });
      expect(deleteResult).toBe(0); 
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  });

  test('Tentative de création d\'adresse avec un type invalide', async () => {
    const name = '456 Elm St';
    const location = 'Town';
    const type = 'invalid'; 
  
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

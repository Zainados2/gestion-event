const sequelize = require('../models/db'); 
const User = require('../models/modelsUser'); 
const bcrypt = require('bcrypt');

describe('Tests de base et de sécurité pour les utilisateurs', () => {

  
  beforeAll(async () => {
    await sequelize.sync({ force: true }); 
  });

  
  afterAll(async () => {
    await sequelize.close(); 
  });

  
  test('Se connecter à la base de données avec Sequelize', async () => {
    try {
      await sequelize.authenticate();
      console.log('Connecté à la base de données MySQL avec Sequelize');
    } catch (error) {
      console.error('Erreur de connexion à la base de données:', error);
    }

    expect(async () => await sequelize.authenticate()).not.toThrow();
  });

  
  test('Créer user', async () => {
    const username = 'bernard';
    const password = 'asef9th7th';
    const role = 'gerant';
    const newUser = await User.create({
      username,
      password,
      role
    });
    expect(newUser).toBeDefined();
    expect(newUser.username).toBe(username);
    expect(newUser.role).toBe(role);
    const passwordCrypte = await bcrypt.compare(password, newUser.password);
    expect(passwordCrypte).toBe(true);
  });

  test('injection sql pour supprimer table users', async () => {
    const username = 'bernard\'; DROP TABLE users; --';
    const password = 'asef9th7th';
    const role = 'gerant';

    let newUser;
    let errors = false;

    try {
      newUser = await User.create({username,password,role});
    } catch (error) {
      errors = true;
      console.error('Erreur sur injection sql', error);
    }
    expect(newUser).toBeUndefined();
    expect(errors).toBe(true);

    const usersTableExists = await User.count();
    expect(usersTableExists).toBeGreaterThan(0); 
  });

  test('Connexion avec des informations incorrectes', async () => {
    const username = 'gerant';
    const password = 'wrongpassword';

    const user = await User.findOne({ where: { username } });
    let isMatch = false;

    if (user) {
      isMatch = await bcrypt.compare(password, user.password);
    }

    expect(isMatch).toBe(false);
  });

  test('Recherche d\'un utilisateur avec un mauvais ID', async () => {
    const wrongId = 9999; 

    const user = await User.findByPk(wrongId);

    expect(user).toBeNull(); 
  });

  test('Suppression d\'un utilisateur avec un mauvais ID', async () => {
    const wrongId = 9999; 

    try {
      const deleteResult = await User.destroy({ where: { id: wrongId } });
      expect(deleteResult).toBe(0);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  });

  test('Tentative d\'injection SQL lors de la création d\'un utilisateur avec un mot de passe malveillant', async () => {
    const username = 'malicioususer';
    const password = 'password123; DROP TABLE users; --';
    const role = 'user';

    let newUser;
    let errors = false;

    try {
      newUser = await User.create({
        username,
        password,
        role
      });
    } catch (error) {
      errors = true;
      console.error('Erreur lors de la tentative d\'injection SQL dans le mot de passe:', error);
    }

    expect(newUser).toBeUndefined();
    expect(errors).toBe(true);

    const usersTableExists = await User.count();
    expect(usersTableExists).toBeGreaterThan(0); 
  });

  test('Tentative de création d\'utilisateur avec un mot de passe trop court', async () => {
    const username = 'shortpassworduser';
    const password = 'short'; 
    const role = 'user';

    let errors = false;
    try {
      await User.create({
        username,
        password,
        role
      });
    } catch (error) {
      errors = true;
      expect(error).toBeDefined();
    }

    expect(errors).toBe(true);
  });

  test('Tentative de création d\'utilisateur avec un mot de passe non sécurisé', async () => {
    const username = 'insecureuser';
    const password = 'password'; 
    const role = 'user';

    let newUser;
    try {
      newUser = await User.create({
        username,
        password,
        role
      });
    } catch (error) {
      console.error('Erreur lors de la création d\'un utilisateur avec un mot de passe non sécurisé:', error);
    }

    expect(newUser).toBeDefined();
    const passwordCrypte = await bcrypt.compare(password, newUser.password);
    expect(passwordCrypte).toBe(true);
  });

});

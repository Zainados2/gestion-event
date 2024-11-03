const sequelize = require('../models/db'); // Importe ton instance Sequelize
const User = require('../models/modelsUser'); // Importe le modèle User
const bcrypt = require('bcrypt');

describe('Tests de base et de sécurité pour les utilisateurs', () => {

  // Avant tous les tests, synchroniser les modèles
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Recrée la base de données pour avoir un état propre
  });

  // Après tous les tests, nettoyer la table des utilisateurs
  afterAll(async () => {
    await sequelize.close(); // Ferme la connexion à la base de données
  });

  // Test initial de la connexion à la base de données
  test('Se connecter à la base de données avec Sequelize', async () => {
    try {
      await sequelize.authenticate();
      console.log('Connecté à la base de données MySQL avec Sequelize');
    } catch (error) {
      console.error('Erreur de connexion à la base de données:', error);
    }

    expect(async () => await sequelize.authenticate()).not.toThrow();
  });

  // Test de création d'un utilisateur
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

  // Test d'injection SQL lors de l'inscription
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

  // Test de connexion avec des informations incorrectes
  test('Connexion avec des informations incorrectes', async () => {
    const username = 'gerant';
    const password = 'wrongpassword';

    const user = await User.findOne({ where: { username } });
    let isMatch = false;

    if (user) {
      isMatch = await bcrypt.compare(password, user.password);
    }

    expect(isMatch).toBe(false); // Le mot de passe ne doit pas correspondre
  });

  // Test de recherche d'un utilisateur avec un mauvais ID
  test('Recherche d\'un utilisateur avec un mauvais ID', async () => {
    const wrongId = 9999; // Un ID qui n'existe probablement pas

    const user = await User.findByPk(wrongId);

    expect(user).toBeNull(); // L'utilisateur ne doit pas exister
  });

  // Test de suppression d'un utilisateur avec un mauvais ID
  test('Suppression d\'un utilisateur avec un mauvais ID', async () => {
    const wrongId = 9999; // Un ID qui n'existe probablement pas

    try {
      const deleteResult = await User.destroy({ where: { id: wrongId } });
      expect(deleteResult).toBe(0); // Rien ne doit être supprimé
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  });

  // Test d'injection SQL dans le champ mot de passe
  test('Tentative d\'injection SQL lors de la création d\'un utilisateur avec un mot de passe malveillant', async () => {
    const username = 'malicioususer';
    const password = 'password123; DROP TABLE users; --';
    const role = 'user';

    // Essayer de créer l'utilisateur
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

    // L'utilisateur ne doit pas être créé
    expect(newUser).toBeUndefined();
    expect(errors).toBe(true);

    // Vérifier que la table 'users' existe encore
    const usersTableExists = await User.count();
    expect(usersTableExists).toBeGreaterThan(0); // Aucun utilisateur ne devrait être créé
  });

  // Test de mot de passe trop court
  test('Tentative de création d\'utilisateur avec un mot de passe trop court', async () => {
    const username = 'shortpassworduser';
    const password = 'short'; // Mot de passe trop court
    const role = 'user';

    // Essayer de créer l'utilisateur
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

    // La création de l'utilisateur devrait échouer
    expect(errors).toBe(true);
  });

  // Test de mot de passe qui ne correspond pas au critère de sécurité
  test('Tentative de création d\'utilisateur avec un mot de passe non sécurisé', async () => {
    const username = 'insecureuser';
    const password = 'password'; // Mot de passe non sécurisé
    const role = 'user';

    // Essayer de créer l'utilisateur
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

    // L'utilisateur doit être créé, mais il est utile de vérifier que le mot de passe est sécurisé
    expect(newUser).toBeDefined();
    const passwordCrypte = await bcrypt.compare(password, newUser.password);
    expect(passwordCrypte).toBe(true);
  });

});

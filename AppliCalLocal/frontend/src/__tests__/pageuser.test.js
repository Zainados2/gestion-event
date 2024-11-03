import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // Fonctions pour rendre et tester les composants.
import '@testing-library/jest-dom'; // Assertions supplémentaires pour le DOM.
import axios from 'axios'; // Pour simuler les appels API.
import LoginPage from '../app/page'; // Composant LoginPage à tester.
import { useAuth } from '../app/contexts/authContext'; // Hook useAuth utilisé dans LoginPage.

// Mock du hook useAuth
jest.mock('../app/contexts/authContext', () => ({
  useAuth: () => ({
    updateAuthContext: jest.fn(), // Fonction fictive pour updateAuthContext.
  }),
}));

// Mock d'axios
jest.mock('axios'); // Simulation des appels API avec axios.

// Mock du hook useRouter de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(), // Fonction fictive pour useRouter.
}));

describe('LoginPage Component', () => {
  let useRouterMock;

  beforeEach(() => {
    useRouterMock = require('next/navigation').useRouter; // Récupération du mock pour useRouter.
    useRouterMock.mockReturnValue({
      push: jest.fn(), // Fonction fictive pour la méthode push.
    });

    jest.clearAllMocks(); // Réinitialisation des mocks avant chaque test.
  });

  test('should successfully login with correct credentials', async () => {
    axios.post.mockResolvedValue({
      data: {
        success: true,
        token: 'mocked_token', // Réponse simulée avec succès.
      },
    });

    render(<LoginPage />); // Rendre le composant pour les tests.

    // Simuler la saisie des identifiants corrects.
    fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { target: { value: 'gerant' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'azerty619' } });

    fireEvent.click(screen.getByText(/Se connecter/i)); // Soumettre le formulaire.

    await waitFor(() => {
      expect(useRouterMock().push).toHaveBeenCalledWith('/calendar'); // Vérifier la redirection.
    });

    expect(localStorage.getItem('token')).toBe('mocked_token'); // Vérifier le stockage du token.
  });

  test('should fail to login with incorrect credentials', async () => {
    axios.post.mockResolvedValue({
      data: {
        success: false,
        message: 'Identifiants incorrects', // Réponse simulée d'échec.
      },
    });

    render(<LoginPage />); // Rendre le composant pour les tests.

    // Simuler la saisie des identifiants incorrects.
    fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { target: { value: 'incorrect_user' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'wrong_password' } });

    fireEvent.click(screen.getByText(/Se connecter/i)); // Soumettre le formulaire.

    await waitFor(() => {
      expect(screen.getByText('Identifiants incorrects')).toBeInTheDocument(); // Vérifier le message d'erreur.
    });
  });

  test('should handle server error', async () => {
    axios.post.mockRejectedValue(new Error('Erreur serveur')); // Simuler une erreur serveur.

    render(<LoginPage />); // Rendre le composant pour les tests.

    // Simuler la saisie des identifiants corrects.
    fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { target: { value: 'gerant' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'azerty619' } });

    fireEvent.click(screen.getByText(/Se connecter/i)); // Soumettre le formulaire.

    await waitFor(() => {
      expect(screen.getByText("Une erreur s'est produite. Veuillez réessayer.")).toBeInTheDocument(); // Vérifier le message d'erreur.
    });
  });
});

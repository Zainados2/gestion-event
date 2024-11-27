import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddressesPage from '../app/lieux/page';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Simuler le contexte d'authentification
const AuthContext = React.createContext();

// Créer un mock adapter pour Axios
const mock = new MockAdapter(axios);

describe('AddressesPage', () => {
  beforeEach(() => {
    mock.reset();
    mock.onGet('http://165.232.115.209:8081/addresses').reply(200, []);
  });

  const renderWithAuth = (ui, { isAuthenticated = true, userRole = 'admin' } = {}) => {
    return render(
      <AuthContext.Provider value={{ isAuthenticated, user: { role: userRole } }}>
        {ui}
      </AuthContext.Provider>
    );
  };

  test('should show an error if fields are not filled in', async () => {
    renderWithAuth(<AddressesPage />);

    fireEvent.click(screen.getByText('Créer Adresse'));

    await waitFor(() => {
      expect(screen.getByText(/Tous les champs doivent être remplis/i)).toBeInTheDocument();
    });
  });

  test('créer une nouvelle adresse et afficher', async () => {
    mock.onPost('http://165.232.115.209:8081/addresses').reply(200, {
      id: 3,
      name: 'Adresse 3',
      location: 'Location 3',
      type: 'studio',
    });

    mock.onGet('http://165.232.115.209:8081/addresses').reply(200, [
      { id: 3, name: 'Adresse 3', location: 'Location 3', type: 'studio' },
    ]);

    renderWithAuth(<AddressesPage />);

    fireEvent.change(screen.getByPlaceholderText("Nom de l'adresse"), { target: { value: 'Adresse 3' } });
    fireEvent.change(screen.getByPlaceholderText("Emplacement de l'adresse"), { target: { value: 'Location 3' } });
    fireEvent.change(screen.getByTestId('create-address-type'), { target: { value: 'studio' } });

    fireEvent.click(screen.getByText('Créer Adresse'));

    await waitFor(() => {
      expect(screen.getByText('Adresse 3 - Location 3 (studio)')).toBeInTheDocument();
    });
  });

  test('affiche la page uniquement si authentifié avec le rôle admin', () => {
    renderWithAuth(<AddressesPage />, { isAuthenticated: true, userRole: 'admin' });

    expect(screen.getByText(/Créer Adresse/i)).toBeInTheDocument();
  });

  test('bloque l’accès si non authentifié', () => {
    renderWithAuth(<AddressesPage />, { isAuthenticated: false });

    expect(screen.queryByText(/Créer Adresse/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Vous devez être connecté pour accéder à cette page/i)).toBeInTheDocument();
  });
});

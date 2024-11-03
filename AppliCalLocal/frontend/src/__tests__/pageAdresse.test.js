import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddressesPage from '../app/lieux/page';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Créez une instance de MockAdapter pour simuler les appels API
const mock = new MockAdapter(axios);

describe('AddressesPage', () => {
  // Réinitialiser le mock avant chaque test
  beforeEach(() => {
    mock.reset();
    mock.onGet('http://localhost:8081/addresses').reply(200, []); // Mocking initial GET request
  });

  test('should show an error if fields are not filled in', async () => {
    render(<AddressesPage />);

    // Cliquer sur le bouton pour créer l'adresse sans remplir les champs
    fireEvent.click(screen.getByText('Créer Adresse'));

    // Vérifier que les messages d'erreur sont affichés
    await waitFor(() => {
      expect(screen.getByText(/Tous les champs doivent être remplis/i)).toBeInTheDocument();
    });
  });

  test('should create a new address and display it', async () => {
    // Simuler la réponse de l'API pour la création d'une nouvelle adresse
    mock.onPost('http://localhost:8081/addresses').reply(200, {
      id: 3,
      name: 'Adresse 3',
      location: 'Location 3',
      type: 'studio',
    });

    // Simuler la réponse de l'API pour récupérer la liste des adresses après la création
    mock.onGet('http://localhost:8081/addresses').reply(200, [
      { id: 3, name: 'Adresse 3', location: 'Location 3', type: 'studio' },
    ]);

    render(<AddressesPage />);

    // Remplir le formulaire de création d'adresse
    fireEvent.change(screen.getByPlaceholderText("Nom de l'adresse"), { target: { value: 'Adresse 3' } });
    fireEvent.change(screen.getByPlaceholderText("Emplacement de l'adresse"), { target: { value: 'Location 3' } });
    fireEvent.change(screen.getByTestId('create-address-type'), { target: { value: 'studio' } });

    // Cliquer sur le bouton pour créer l'adresse
    fireEvent.click(screen.getByText('Créer Adresse'));

    // Vérifier que l'adresse nouvellement créée est affichée dans le DOM
    await waitFor(() => {
      expect(screen.getByText('Adresse 3 - Location 3 (studio)')).toBeInTheDocument();
    });
  });

  test('should retrieve and display "Adresse 3" after it is created', async () => {
    // Simuler la réponse de l'API pour la création d'une nouvelle adresse
    mock.onPost('http://localhost:8081/addresses').reply(200, {
      id: 3,
      name: 'Adresse 3',
      location: 'Location 3',
      type: 'studio',
    });

    // Simuler la réponse de l'API pour récupérer la liste des adresses après la création
    mock.onGet('http://localhost:8081/addresses').reply(200, [
      { id: 3, name: 'Adresse 3', location: 'Location 3', type: 'studio' },
    ]);

    render(<AddressesPage />);

    // Remplir le formulaire de création d'adresse
    fireEvent.change(screen.getByPlaceholderText("Nom de l'adresse"), { target: { value: 'Adresse 3' } });
    fireEvent.change(screen.getByPlaceholderText("Emplacement de l'adresse"), { target: { value: 'Location 3' } });
    fireEvent.change(screen.getByTestId('create-address-type'), { target: { value: 'studio' } });

    // Cliquer sur le bouton pour créer l'adresse
    fireEvent.click(screen.getByText('Créer Adresse'));

    // Vérifier que l'adresse nouvellement créée est affichée dans le DOM
    await waitFor(() => {
      expect(screen.getByText('Adresse 3 - Location 3 (studio)')).toBeInTheDocument();
    });

    // Simuler la réponse de l'API pour récupérer l'adresse "Adresse 3"
    mock.onGet('http://localhost:8081/addresses/3').reply(200, {
      id: 3,
      name: 'Adresse 3',
      location: 'Location 3',
      type: 'studio',
    });

   

    // Vérifier que l'adresse "Adresse 3" est bien récupérée et affichée
    await waitFor(() => {
      expect(screen.getByText('Adresse 3 - Location 3 (studio)')).toBeInTheDocument();
    });
  });

  test('should delete an address and ensure it is no longer displayed', async () => {
    // Simuler la réponse de l'API pour la création d'une nouvelle adresse
    mock.onPost('http://localhost:8081/addresses').reply(200, {
      id: 3,
      name: 'Adresse 3',
      location: 'Location 3',
      type: 'studio',
    });

    // Simuler la réponse de l'API pour récupérer la liste des adresses après la création
    mock.onGet('http://localhost:8081/addresses').reply(200, [
      { id: 3, name: 'Adresse 3', location: 'Location 3', type: 'studio' },
    ]);

    // Simuler la réponse de l'API pour la suppression d'une adresse
    mock.onDelete('http://localhost:8081/addresses/3').reply(200);

    render(<AddressesPage />);

    // Remplir le formulaire de création d'adresse
    fireEvent.change(screen.getByPlaceholderText("Nom de l'adresse"), { target: { value: 'Adresse 3' } });
    fireEvent.change(screen.getByPlaceholderText("Emplacement de l'adresse"), { target: { value: 'Location 3' } });
    fireEvent.change(screen.getByTestId('create-address-type'), { target: { value: 'studio' } });

    // Cliquer sur le bouton pour créer l'adresse
    fireEvent.click(screen.getByText('Créer Adresse'));

    // Vérifier que l'adresse nouvellement créée est affichée dans le DOM
    await waitFor(() => {
      expect(screen.getByText('Adresse 3 - Location 3 (studio)')).toBeInTheDocument();
    });

    // Simuler la suppression de l'adresse
    fireEvent.click(screen.getByText('Supprimer'));

    // Simuler la réponse de l'API pour récupérer la liste des adresses après suppression
    mock.onGet('http://localhost:8081/addresses').reply(200, []);

    // Vérifier que l'adresse "Adresse 3" n'est plus affichée dans le DOM
    await waitFor(() => {
      expect(screen.queryByText('Adresse 3 - Location 3 (studio)')).not.toBeInTheDocument();
    });
  });
});

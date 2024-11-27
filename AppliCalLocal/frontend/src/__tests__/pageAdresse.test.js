import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddressesPage from '../app/lieux/page';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('AddressesPage', () => {
  beforeEach(() => {
    mock.reset();
    mock.onGet('http://165.232.115.209:8081/addresses').reply(200, []); 
  });

  test('should show an error if fields are not filled in', async () => {
    render(<AddressesPage />);

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

    render(<AddressesPage />);

    fireEvent.change(screen.getByPlaceholderText("Nom de l'adresse"), { target: { value: 'Adresse 3' } });
    fireEvent.change(screen.getByPlaceholderText("Emplacement de l'adresse"), { target: { value: 'Location 3' } });
    fireEvent.change(screen.getByTestId('create-address-type'), { target: { value: 'studio' } });

    fireEvent.click(screen.getByText('Créer Adresse'));

    await waitFor(() => {
      expect(screen.getByText('Adresse 3 - Location 3 (studio)')).toBeInTheDocument();
    });
  });

  test('récupérer et afficher Adresse 3 après creation', async () => {
    mock.onPost('http://165.232.115.209:8081/addresses').reply(200, {
      id: 3,
      name: 'Adresse 3',
      location: 'Location 3',
      type: 'studio',
    });

    mock.onGet('http://165.232.115.209:8081/addresses').reply(200, [
      { id: 3, name: 'Adresse 3', location: 'Location 3', type: 'studio' },
    ]);

    render(<AddressesPage />);

    fireEvent.change(screen.getByPlaceholderText("Nom de l'adresse"), { target: { value: 'Adresse 3' } });
    fireEvent.change(screen.getByPlaceholderText("Emplacement de l'adresse"), { target: { value: 'Location 3' } });
    fireEvent.change(screen.getByTestId('create-address-type'), { target: { value: 'studio' } });

    fireEvent.click(screen.getByText('Créer Adresse'));

    await waitFor(() => {
      expect(screen.getByText('Adresse 3 - Location 3 (studio)')).toBeInTheDocument();
    });

    mock.onGet('http://165.232.115.209:8081/addresses/3').reply(200, {
      id: 3,
      name: 'Adresse 3',
      location: 'Location 3',
      type: 'studio',
    });

   

    await waitFor(() => {
      expect(screen.getByText('Adresse 3 - Location 3 (studio)')).toBeInTheDocument();
    });
  });

  test('supprimer une adresse et voir sa disparition', async () => {
    mock.onPost('http://165.232.115.209:8081/addresses').reply(200, {
      id: 3,
      name: 'Adresse 3',
      location: 'Location 3',
      type: 'studio',
    });

    mock.onGet('http://165.232.115.209:8081/addresses').reply(200, [
      { id: 3, name: 'Adresse 3', location: 'Location 3', type: 'studio' },
    ]);

    mock.onDelete('http://165.232.115.209:8081/addresses/3').reply(200);

    render(<AddressesPage />);

    fireEvent.change(screen.getByPlaceholderText("Nom de l'adresse"), { target: { value: 'Adresse 3' } });
    fireEvent.change(screen.getByPlaceholderText("Emplacement de l'adresse"), { target: { value: 'Location 3' } });
    fireEvent.change(screen.getByTestId('create-address-type'), { target: { value: 'studio' } });

    fireEvent.click(screen.getByText('Créer Adresse'));

    await waitFor(() => {
      expect(screen.getByText('Adresse 3 - Location 3 (studio)')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Supprimer'));

    mock.onGet('http://165.232.115.209:8081/addresses').reply(200, []);

    await waitFor(() => {
      expect(screen.queryByText('Adresse 3 - Location 3 (studio)')).not.toBeInTheDocument();
    });
  });
});
